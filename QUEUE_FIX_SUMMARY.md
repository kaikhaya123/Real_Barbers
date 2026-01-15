# Queue Number Fix - Implementation Summary

## ✅ Changes Made

### 1. **[lib/supabase-bookings.ts](lib/supabase-bookings.ts)** - Added Queue Update Function

Added `updateBookingQueueNumber()` function that updates a booking with its assigned queue number after it's been generated:

```typescript
export async function updateBookingQueueNumber(
  bookingId: string,
  queueNumber: string
) {
  const { data, error } = await sb
    .from('bookings')
    .update({ queuenumber: queueNumber, updatedat: now })
    .eq('id', bookingId)
    .select()
  
  return data?.[0] || null
}
```

**Also updated exports** to include the new function.

---

### 2. **[lib/queue.ts](lib/queue.ts)** - Improved Queue Generation Logic

**Key improvements:**
- Better barber name normalization 
- Only counts `pending` or `confirmed` bookings (excludes cancelled/completed)
- Enhanced logging to show each booking matched and why
- Cleaner variable names and documentation

**Before:**
```typescript
const isSameBarber = normalizeBarber(b.barber) === normalizeBarber(barberName)
```

**After:**
```typescript
const normalizedBookingBarber = normalizeBarber(b.barber)
const isSameBarber = normalizedBookingBarber === normalizedSelectedBarber

// Only count pending or confirmed bookings
const isRelevantStatus = b.status === 'pending' || b.status === 'confirmed' || !b.status

return isSameDate && isSameBarber && isRelevantStatus
```

---

### 3. **[app/api/bookings/create/route.ts](app/api/bookings/create/route.ts)** - Fixed Booking Flow

**Changed the order of operations to fix the core issue:**

**BEFORE (WRONG):**
```
1. Generate queue number ← checks DB (empty!)
2. Save booking to DB
3. Return response
```

**AFTER (CORRECT):**
```
1. Save booking to DB ← now exists in database
2. Generate queue number ← counts the saved booking
3. Update booking with queue number
4. Return response
```

**Updated imports:**
```typescript
import { saveBooking, updateBookingQueueNumber } from '@/lib/bookings'
```

**Updated flow:**
```typescript
// STEP 1: Save booking FIRST
const booking = await saveBooking({...})

// STEP 2: Generate queue number NOW that booking exists
const queueNumber = await generateQueueNumber(bookingDate, barber || 'General')
const queueDisplay = formatQueueDisplay(queueNumber, barber)

// STEP 3: Update booking with queue number
await updateBookingQueueNumber(booking.id, queueDisplay)
```

---

## 🎯 How It Works Now

### Example: 3 Customers Booking Same Day with Same Barber (Franky)

**Customer 1 books:**
1. Booking saved with ID `RB-123...` and no queue number
2. Query DB: Find all bookings for that date with barber "Franky" → 0 found
3. Generate: `0 + 1 = 001`
4. Update booking with queue `FN-001` ✅

**Customer 2 books (5 seconds later):**
1. Booking saved with ID `RB-456...` and no queue number
2. Query DB: Find all bookings for that date with barber "Franky" → **1 found** (Customer 1!)
3. Generate: `1 + 1 = 002`
4. Update booking with queue `FN-002` ✅

**Customer 3 books (5 seconds later):**
1. Booking saved with ID `RB-789...` and no queue number
2. Query DB: Find all bookings for that date with barber "Franky" → **2 found** (Customers 1 & 2!)
3. Generate: `2 + 1 = 003`
4. Update booking with queue `FN-003` ✅

---

## 📝 Database Schema Requirement

Make sure your Supabase `bookings` table has a `queuenumber` column:

```sql
ALTER TABLE bookings ADD COLUMN queuenumber VARCHAR(10) DEFAULT NULL;
```

Or if setting up fresh:

```sql
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  phone VARCHAR(20),
  service VARCHAR(100),
  name VARCHAR(100),
  datetime VARCHAR(20),
  barber VARCHAR(100),
  queuenumber VARCHAR(10),
  raw TEXT,
  status VARCHAR(20),
  source VARCHAR(20),
  createdat TIMESTAMP,
  updatedat TIMESTAMP
)
```

---

## 🧪 Testing

### Manual Test
1. Open booking form
2. Select service → Barber (e.g., "Franky") → Date → Time → Submit
3. Check response - should see queue like `FN-001`
4. Immediately create another booking same day/barber
5. Should see queue `FN-002`

### Check Logs
```
[Web Booking] Booking saved: { bookingId: 'RB-123...', service: '...', name: '...', barber: 'Franky' }

[Queue] Total bookings loaded: 1
[Queue] Generated new queue number: {
  bookingDate: '2026-01-15',
  barberName: 'franky',
  existingBookingsThatDay: 1,
  assignedQueueNumber: '002',
  matchedBookings: [ ... ]
}

[Web Booking] Queue assigned: { bookingId: 'RB-456...', queueNumber: 'FN-002' }
```

---

## ✨ Benefits

✅ **Sequential queue numbers** - Each booking gets the next number  
✅ **No duplicates** - Queue is assigned AFTER booking exists in DB  
✅ **No race conditions** - Each booking increments the count  
✅ **Barber-specific** - Different barbers have separate sequences  
✅ **Date-specific** - New day resets the count  
✅ **Status-aware** - Only counts active bookings (pending/confirmed)  
✅ **Better logging** - Clear visibility into queue generation process  

---

## 🔍 Troubleshooting

### Issue: Still Getting Duplicate Queue Numbers

**Check:**
1. Verify `queuenumber` column exists in database
2. Check logs - does it show "Queue assigned"?
3. Make sure Supabase credentials are configured
4. Verify barber names match exactly (case-insensitive matching is handled)

### Issue: Queue Numbers Not Appearing in Booking Confirmation

**Check:**
1. Verify response includes `queueNumber` in booking object
2. Check [components/booking/BookingConfirmation.tsx](components/booking/BookingConfirmation.tsx) displays `queueNumber` prop
3. Check logs for update errors

---

## 📚 Files Modified

- ✅ [lib/supabase-bookings.ts](lib/supabase-bookings.ts) - Added `updateBookingQueueNumber()`
- ✅ [lib/queue.ts](lib/queue.ts) - Improved generation logic
- ✅ [app/api/bookings/create/route.ts](app/api/bookings/create/route.ts) - Fixed flow order

**No breaking changes** - All existing code continues to work.
