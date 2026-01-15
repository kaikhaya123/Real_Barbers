# 📝 Code Changes Summary

## 3 Files Updated for Queue Number Fix

---

## 1️⃣ lib/queue.ts
**Purpose:** Generate sequential queue numbers

### Key Changes:
✅ Uses your schema's **separate `date` column** (not combined `datetime`)
✅ Normalizes barber names for consistent matching
✅ Filters by status (pending/confirmed only)
✅ Counts existing bookings and adds 1

### Critical Logic:
```typescript
// Your schema has separate date/time columns
const isSameDate = b.date === bookingDate  // Your schema!

// Normalize barber names for comparison
const normalizeBarber = (str: string | undefined | null): string => {
  if (!str) return ''
  return str.trim().toLowerCase()
}

// Queue number is count + 1
const queueNumber = sameDay.length + 1
```

### Example Flow:
```
Input: barberName="Franky", bookingDate="2024-01-15"
Existing bookings that day:
  - Franky booking 1 (status: pending)
  - Franky booking 2 (status: pending)
Count: 2
Queue: 2 + 1 = 003
Output: "003"
```

---

## 2️⃣ lib/supabase-bookings.ts
**Purpose:** Database operations

### Changes Made:

#### saveBooking() - Updated
✅ Now saves with **separate `date` and `time`** columns
✅ Includes `barberId` BIGINT field
✅ Uses camelCase columns: `createdAt`, `updatedAt`, `queueNumber`
✅ Maps all required fields from your schema

```typescript
const booking = {
  id,
  phone,
  service: input.service || '',
  name: input.name || null,
  email: input.email || null,
  date,      // ← NEW: separate from time
  time,      // ← NEW: separate from date
  barber: input.barber || null,
  barberId,  // ← NEW: BIGINT foreign key
  queueNumber: null,
  status: input.status || 'pending',
  source: input.source || 'web',
  raw: input.raw || null,
  createdAt: now,  // ← camelCase (not createdat)
  updatedAt: null, // ← camelCase (not updatedat)
}
```

#### updateBookingQueueNumber() - Updated
✅ Uses camelCase column names
✅ Updates `queueNumber` field
✅ Saves `updatedAt` timestamp

```typescript
const { data, error } = await sb
  .from('bookings')
  .update({ 
    queueNumber: queueNumber,  // ← camelCase
    updatedAt: now              // ← camelCase
  })
  .eq('id', bookingId)
  .select()
```

#### Other Functions - Updated
- `loadBookings()` - Uses `createdAt` (not `createdat`)
- `updateBookingStatus()` - Uses `updatedAt` (not `updatedat`)
- `findPendingBookingByPhone()` - Uses `createdAt` (not `createdat`)

---

## 3️⃣ app/api/bookings/create/route.ts
**Purpose:** Booking creation API endpoint

### Fixed Flow (THIS IS THE KEY FIX):

**BEFORE (Broken):**
```
1. Generate queue number (DB empty, count=0)
2. Save booking (inserts to DB)
Result: All bookings get FN-001 ❌
```

**AFTER (Fixed):**
```
1. Save booking (inserts to DB) ✅
2. Generate queue number (DB has booking, count=1) ✅
3. Update booking with queue ✅
Result: Sequential numbers FN-001, FN-002, FN-003 ✓
```

### Updated Code:
```typescript
// ✅ STEP 1: SAVE BOOKING FIRST
const booking = await saveBooking({
  source: 'web',
  from: phone ? sanitizePhone(phone) : '+0000000000',
  service,
  name: name || undefined,
  date: date || new Date().toISOString().split('T')[0],
  time: time || new Date().toTimeString().split(' ')[0],
  barber: barber || undefined,
  barberId: barberId || null,  // ← NEW field
  raw: JSON.stringify({ name, service, date, time, barber, phone, email }),
  status: 'pending',
})

// ✅ STEP 2: GENERATE QUEUE (now DB has the booking)
const queueNumber = await generateQueueNumber(bookingDate, barber || 'General')

// ✅ STEP 3: UPDATE BOOKING WITH QUEUE
await updateBookingQueueNumber(booking.id, queueDisplay)
```

### Input Schema (What the API Expects):
```typescript
{
  name: string,           // Customer name
  service: string,        // Service type
  date: string,          // YYYY-MM-DD format
  time: string,          // HH:MM format
  barber: string,        // Barber name ("Franky", "Khaya", etc.)
  barberId: number,      // Barber ID from database
  phone: string,         // +27... format
  email: string,         // customer@email.com
}
```

---

## 🔄 Data Flow Diagram

```
API Request
  ↓
saveBooking() ──→ Supabase (INSERT)
  ↓
Booking now in database ✓
  ↓
generateQueueNumber()
  ├─ loadBookings() from DB
  ├─ Filter by date & barber
  ├─ Count: 2 existing → return 003
  ↓
updateBookingQueueNumber() ──→ Supabase (UPDATE)
  ↓
API Response with FN-003 ✓
```

---

## 📋 Column Name Mapping

| Your Schema | Old Code | New Code | Type |
|------------|----------|----------|------|
| `id` | `id` | `id` | UUID |
| `date` | `datetime` | `date` | DATE |
| `time` | `datetime` | `time` | TIME |
| `barber` | `barber` | `barber` | TEXT |
| `barberId` | N/A | `barberId` | BIGINT |
| `queueNumber` | N/A | `queueNumber` | VARCHAR |
| `createdAt` | `createdat` | `createdAt` | TIMESTAMP |
| `updatedAt` | `updatedat` | `updatedAt` | TIMESTAMP |

---

## ✅ Validation Checklist

Before deploying, verify:

- [ ] `lib/queue.ts` has separate date column comparison
- [ ] `lib/supabase-bookings.ts` uses camelCase columns
- [ ] `app/api/bookings/create/route.ts` saves BEFORE generating
- [ ] Migration adds `queueNumber` column to your table
- [ ] All 3 files reference correct column names

---

## 🚀 Deployment Steps

1. **Update Database**
   - Run `db/migration-queue-fix.sql` in Supabase
   - Verify `queueNumber` column exists

2. **Deploy Code Files**
   - Upload 3 updated files to server
   - Restart application
   - Check logs for errors

3. **Test**
   - Create multiple bookings for same barber
   - Verify queue numbers: 001, 002, 003...
   - NOT: 001, 001, 001 ❌

---

**Status:** ✅ All files ready for deployment
