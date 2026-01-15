# Queue Number Bug Analysis: Why Everyone Gets FN-001

## Problem Summary
When multiple customers book appointments, they all receive the same queue number (FN-001) instead of sequential numbers (FN-001, FN-002, FN-003, etc.).

---

## Root Cause

### The Issue in `generateQueueNumber()` - [lib/queue.ts](lib/queue.ts#L28-L65)

The function attempts to count existing bookings for the same date and barber:

```typescript
// Get bookings for the same date and barber
const sameDay = bookings.filter((b: DbBooking) => {
  if (!b.datetime) return false
  
  const bookingDateOnly = b.datetime.split(' ')[0] // Get YYYY-MM-DD part
  const isSameDate = bookingDateOnly === bookingDate
  
  const normalizeBarber = (str: string | undefined | null) => 
    str?.trim().toLowerCase() || ''
  
  const isSameBarber = normalizeBarber(b.barber) === normalizeBarber(barberName)
  
  return isSameDate && isSameBarber
})

// Queue number is count + 1, padded to 3 digits
const queueNumber = sameDay.length + 1
return String(queueNumber).padStart(3, '0')
```

**The problem:** The queue number is calculated as `sameDay.length + 1`, which means:
- **First booking:** 0 existing bookings → `0 + 1 = 001` ✓
- **Second booking:** Also 0 existing bookings → `0 + 1 = 001` ✗ (SAME NUMBER!)

### Why All Bookings Return 0 Existing Bookings

The issue is **timing and data state**. When a new booking is created:

1. **Customer A books** → Queue generates at time T₁
   - Checks Supabase for bookings → Database is EMPTY or doesn't include the NEW booking yet
   - Result: `sameDay.length = 0` → Queue = 001

2. **Customer B books** → Queue generates at time T₂
   - Meanwhile, Customer A's booking hasn't been fully written/indexed yet
   - Checks Supabase for bookings → Still sees 0 bookings (or stale data)
   - Result: `sameDay.length = 0` → Queue = 001 (SAME!)

3. **Customer C books** → Same problem repeats

### Secondary Issues

#### Issue 1: Barber Matching Problem
The barber passed might be in different formats:
- From UI: `"Franky"` (selected barber object)
- From database: `null`, `"Franky"`, `"franky"`, or undefined
- The normalization helps but doesn't account for:
  - When `barber` is selected correctly in UI
  - When database has NULL barbers (no barber assigned yet)

**Current code:**
```typescript
const isSameBarber = normalizeBarber(b.barber) === normalizeBarber(barberName)
```

When `barber` is `"Franky"` and database has `null` bookings:
- `normalizeBarber(null)` → `""` (empty string)
- `normalizeBarber("Franky")` → `"franky"`
- `"" !== "franky"` → Doesn't match
- So it might be counting correctly, but filtering incorrectly

#### Issue 2: No Race Condition Protection
If two bookings are created simultaneously, the `generateQueueNumber()` function could be called twice before either booking is saved:

```
T1: generateQueueNumber() → sees 0 bookings → returns 001
T1: generateQueueNumber() → sees 0 bookings → returns 001  (parallel request)
T2: Both save with queue 001
```

---

## How It SHOULD Work

The queue number should be generated **AFTER** the booking is saved to the database, not before. However, currently it's generated **BEFORE**:

**Current Flow:**
```
1. generateQueueNumber()      ← Queries DB (still empty)
2. saveBooking()              ← Inserts into DB
3. API returns queue number
```

**Correct Flow:**
```
1. saveBooking()              ← Insert first
2. generateQueueNumber()      ← Then query to count
3. updateBooking()            ← Set queue number
4. API returns queue number
```

---

## Solution

### Quick Fix: Use Booking Count in Queue Generation

Modify [lib/queue.ts](lib/queue.ts) to properly count:

```typescript
export async function generateQueueNumber(bookingDate: string, barberName: string): Promise<string> {
  try {
    const bookings = await loadBookings() as DbBooking[]
    
    console.log('[Queue] Total bookings:', bookings.length)
    
    // Filter for same date AND barber (more inclusive matching)
    const sameDay = bookings.filter((b: DbBooking) => {
      if (!b.datetime) return false
      
      const bookingDateOnly = b.datetime.split(' ')[0]
      const isSameDate = bookingDateOnly === bookingDate
      
      // Handle barber matching - also include null/empty barber cases
      const normalizeBarber = (str: string | undefined | null) => 
        str?.trim().toLowerCase() || ''
      
      const bBarberNorm = normalizeBarber(b.barber)
      const selectedBarberNorm = normalizeBarber(barberName)
      
      // Match if both are specified and equal, OR both are empty
      const isSameBarber = bBarberNorm === selectedBarberNorm || 
                          (bBarberNorm === '' && selectedBarberNorm === '')
      
      return isSameDate && isSameBarber
    })
    
    const queueNumber = sameDay.length + 1
    console.log('[Queue] Queue number:', {
      bookingDate,
      barberName,
      existingBookings: sameDay.length,
      newQueueNumber: String(queueNumber).padStart(3, '0'),
    })
    
    return String(queueNumber).padStart(3, '0')
  } catch (err) {
    console.error('[Queue] Error generating queue number:', err)
    return String(Date.now() % 1000).padStart(3, '0')
  }
}
```

### Proper Fix: Generate Queue After Saving

Modify [app/api/bookings/create/route.ts](app/api/bookings/create/route.ts) to:

```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, service, datetime, barber, phone, email } = body

    if (!service) {
      return NextResponse.json({ error: 'Service is required' }, { status: 400 })
    }

    // ✓ STEP 1: Save booking FIRST (without queue number)
    const booking = await saveBooking({
      source: 'web',
      from: phone ? sanitizePhone(phone) : '+0000000000',
      service,
      name: name || undefined,
      datetime: datetime || undefined,
      barber: barber || undefined,
      raw: JSON.stringify({ name, service, datetime, barber, phone, email }),
      status: 'pending',
    })

    // ✓ STEP 2: Generate queue number AFTER booking exists in DB
    const bookingDate = datetime?.split(' ')[0] || new Date().toISOString().split('T')[0]
    const queueNumber = await generateQueueNumber(bookingDate, barber || 'General')
    const queueDisplay = formatQueueDisplay(queueNumber, barber)

    // ✓ STEP 3: Update booking with queue number
    // (Add a new function: updateBookingQueueNumber() to supabase-bookings.ts)
    // await updateBookingQueueNumber(booking.id, queueDisplay)

    console.log('[Web Booking] Created with queue:', { 
      bookingId: booking.id, 
      queueNumber: queueDisplay 
    })

    // ... rest of confirmation logic ...
  } catch (err: any) {
    console.error('[Web Booking] Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create booking' }, { status: 500 })
  }
}
```

---

## Testing the Fix

After implementing the fix, test with:

1. **Sequential Bookings:**
   - Book appointment 1 → Should get FN-001
   - Book appointment 2 (same date/barber) → Should get FN-002
   - Book appointment 3 (same date/barber) → Should get FN-003

2. **Different Barbers:**
   - Book with Franky → FN-001
   - Book with different barber (same date) → Should have separate sequence

3. **Check Logs:**
   - Verify logs show increasing `existingBookings` count
   - Confirm barber matching is working correctly

---

## Files to Modify

1. **[lib/queue.ts](lib/queue.ts)** - Improve barber matching logic
2. **[app/api/bookings/create/route.ts](app/api/bookings/create/route.ts)** - Generate queue AFTER saving
3. **[lib/supabase-bookings.ts](lib/supabase-bookings.ts)** - Add queue number update function (if needed)

---

## Summary Table

| Issue | Current Behavior | Root Cause | Solution |
|-------|------------------|-----------|----------|
| All bookings get FN-001 | Queue generated before save | DB is empty when counting | Save booking first, then generate queue |
| Barber matching | Inconsistent | Different formats in DB | Improve normalization & handle nulls |
| Race conditions | Possible duplicate queues | No locking mechanism | Use DB transaction or post-save generation |
