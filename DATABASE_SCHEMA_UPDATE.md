# Database Schema Update - Queue Number Fix

## 📊 New Database Schema

### Updated Bookings Table Structure

```sql
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  name TEXT,
  datetime VARCHAR(20),
  barber TEXT,
  queuenumber VARCHAR(10),              -- ✨ NEW: Queue number (e.g., "FN-001")
  raw TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  source TEXT DEFAULT 'web',
  createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedat TIMESTAMP WITH TIME ZONE
);
```

### Column Descriptions

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | TEXT | Unique booking identifier | `RB-mk1c7lmj-8nwk7i` |
| `phone` | TEXT | Customer phone number | `27682188679` |
| `service` | TEXT | Service name | `PROFESSIONAL HAIRCUT` |
| `name` | TEXT | Customer name | `Thabo` |
| `datetime` | VARCHAR(20) | Booking date and time | `2026-01-10 15:00` |
| `barber` | TEXT | Assigned barber name | `Franky` |
| **`queuenumber`** | VARCHAR(10) | **Queue number with initials** | **`FN-001`** |
| `raw` | TEXT | Raw booking data (JSON) | `{...}` |
| `status` | TEXT | Booking status | `pending`, `confirmed`, `completed`, `cancelled` |
| `source` | TEXT | Where booking came from | `web`, `twilio`, `whatsapp` |
| `createdat` | TIMESTAMP | When booking was created | `2026-01-15T10:30:00Z` |
| `updatedat` | TIMESTAMP | When booking was last updated | `2026-01-15T10:32:45Z` |

---

## 🚀 Deployment Instructions

### Option 1: Fresh Database Setup (New Project)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project's SQL Editor
3. Create new query and copy the contents of **[db/supabase-setup-clean.sql](db/supabase-setup-clean.sql)**
4. Run the query
5. Tables will be created with the new `queuenumber` column

**Done!** Your database is ready with the queue fix.

---

### Option 2: Existing Database Migration

If you already have a bookings table **without** the `queuenumber` column:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project's SQL Editor
3. Create new query and copy the contents of **[db/migration-queue-fix.sql](db/migration-queue-fix.sql)**
4. Run the query

**Done!** The `queuenumber` column has been added.

---

## 📝 Complete Updated Schema File

Here's the updated `supabase-setup-clean.sql` with the queue fix integrated:

```sql
-- -*- sql-dialect: postgres -*-
-- PostgreSQL/Supabase SQL - Pro Barber Shop Database Schema
-- Updated with Queue Number Fix - January 15, 2026

-- ============================================================================
-- BOOKINGS TABLE (UPDATED)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  name TEXT,
  datetime VARCHAR(20),
  barber TEXT,
  queuenumber VARCHAR(10),
  raw TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  source TEXT DEFAULT 'web',
  createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedat TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_barber_datetime ON public.bookings(barber, datetime);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_queuenumber ON public.bookings(queuenumber);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select bookings" ON public.bookings
  FOR SELECT USING (true);

CREATE POLICY "Allow public update bookings" ON public.bookings
  FOR UPDATE USING (true);

-- ============================================================================
-- GRANTS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON public.bookings TO anon;
```

---

## 🔍 Verification

### Check if Column Exists

Run this query in Supabase SQL Editor:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
```

**Expected output should include:**
```
queuenumber | character varying | YES
```

### View Sample Bookings with Queue Numbers

```sql
SELECT id, name, barber, datetime, queuenumber, status
FROM public.bookings
WHERE queuenumber IS NOT NULL
ORDER BY createdat DESC
LIMIT 10;
```

**Expected output:**
```
id          | name   | barber  | datetime           | queuenumber | status
RB-123...   | Thabo  | Franky  | 2026-01-10 15:00   | FN-001      | pending
RB-456...   | Mandla | Franky  | 2026-01-10 15:30   | FN-002      | pending
RB-789...   | Sipho  | Franky  | 2026-01-10 16:00   | FN-003      | pending
```

---

## 📋 Data Model Changes

### Before (Old Schema)
```
Booking {
  id
  phone
  service
  name
  datetime
  barber
  status
  source
  createdat
  updatedat
  raw
}
```

### After (New Schema)
```
Booking {
  id
  phone
  service
  name
  datetime
  barber
  ✨ queuenumber       ← NEW!
  status
  source
  createdat
  updatedat
  raw
}
```

---

## 🔄 Migration Checklist

- [ ] Backup current database (recommended)
- [ ] Review [db/migration-queue-fix.sql](db/migration-queue-fix.sql)
- [ ] Run migration in Supabase SQL Editor
- [ ] Verify column was added using the query above
- [ ] Test booking flow to ensure queue numbers are assigned
- [ ] Check logs for any errors
- [ ] Deploy updated code with the 3 modified files:
  - [lib/supabase-bookings.ts](../lib/supabase-bookings.ts)
  - [lib/queue.ts](../lib/queue.ts)
  - [app/api/bookings/create/route.ts](../app/api/bookings/create/route.ts)

---

## 🆘 Troubleshooting

### Issue: Migration fails with "column already exists"
**Solution:** The column already exists. Skip migration and verify it's correct using the verification query above.

### Issue: Queue numbers still not showing
**Checklist:**
1. ✅ Database column `queuenumber` exists
2. ✅ Code updated in [lib/supabase-bookings.ts](../lib/supabase-bookings.ts)
3. ✅ Code updated in [lib/queue.ts](../lib/queue.ts)
4. ✅ Code updated in [app/api/bookings/create/route.ts](../app/api/bookings/create/route.ts)
5. ✅ Application restarted/redeployed
6. ✅ Supabase credentials configured
7. ✅ Check server logs for errors

### Issue: Can't connect to Supabase
**Solution:** Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables are set.

---

## 📚 Related Files

- ✅ [db/supabase-setup-clean.sql](supabase-setup-clean.sql) - Complete schema (updated)
- ✅ [db/migration-queue-fix.sql](migration-queue-fix.sql) - Migration script (new)
- ✅ [lib/supabase-bookings.ts](../lib/supabase-bookings.ts) - Code with queue update function
- ✅ [lib/queue.ts](../lib/queue.ts) - Improved queue generation
- ✅ [app/api/bookings/create/route.ts](../app/api/bookings/create/route.ts) - Fixed booking flow
- ✅ [QUEUE_FIX_SUMMARY.md](../QUEUE_FIX_SUMMARY.md) - Implementation summary

---

## ✨ Benefits of This Schema

✅ **Queue Number Tracking** - Each booking gets a unique sequential queue number  
✅ **Barber-Specific Queues** - Different barbers have separate sequences  
✅ **Date-Based Sequencing** - New day resets the queue count  
✅ **Performance Optimized** - Index on `queuenumber` for fast lookups  
✅ **Status-Aware** - Tracks booking lifecycle (pending → confirmed → completed)  
✅ **Audit Trail** - `createdat` and `updatedat` timestamps for tracking  

---

## 📞 Support

For issues or questions about the database schema:
1. Check [QUEUE_FIX_SUMMARY.md](../QUEUE_FIX_SUMMARY.md) for code implementation details
2. Review server logs for error messages
3. Verify Supabase connection in Supabase dashboard
