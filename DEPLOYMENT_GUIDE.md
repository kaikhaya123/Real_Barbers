# 🚀 Deployment Guide - Queue Number Fix

## ⏱️ Time Required
- **Database Migration:** 2-5 minutes
- **Code Deployment:** 5-10 minutes
- **Testing:** 5 minutes
- **Total:** ~15 minutes

---

## 📋 Pre-Deployment Checklist

- [ ] Have Supabase dashboard open
- [ ] Have access to SQL Editor
- [ ] Have code ready to deploy
- [ ] Read this entire guide
- [ ] Backup is optional but recommended

---

## 🔧 Step 1: Database Migration

### For Fresh Database (New Project)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **SQL Editor** 
3. Click **New Query**
4. Copy the entire contents of [db/supabase-setup-clean.sql](db/supabase-setup-clean.sql)
5. Paste into the editor
6. Click **Run**
7. ✅ All tables created with queue support

**Time:** ~2 minutes

---

### For Existing Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **SQL Editor**
3. Click **New Query**
4. Copy the following minimal migration:

```sql
-- Add queuenumber column if missing
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS queuenumber VARCHAR(10);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_queuenumber 
ON public.bookings(queuenumber);

CREATE INDEX IF NOT EXISTS idx_bookings_barber_datetime 
ON public.bookings(barber, datetime);
```

5. Paste into the editor
6. Click **Run**
7. ✅ Column added successfully

**Time:** ~1 minute

---

## 🔍 Step 2: Verify Migration

Run this verification query:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;
```

**Expected output includes:**
```
Column Name    | Data Type         | Nullable
queuenumber    | character varying | YES
```

✅ If you see this, migration is successful!

---

## 💻 Step 3: Deploy Code Changes

### Files to Update in Your Repository

1. **[lib/supabase-bookings.ts](../lib/supabase-bookings.ts)**
   - ✅ Already updated with `updateBookingQueueNumber()` function

2. **[lib/queue.ts](../lib/queue.ts)**
   - ✅ Already updated with improved queue generation logic

3. **[app/api/bookings/create/route.ts](../app/api/bookings/create/route.ts)**
   - ✅ Already updated to generate queue AFTER saving booking

### Deployment Method

**Option A: Git Push (Recommended)**
```bash
git add lib/supabase-bookings.ts lib/queue.ts app/api/bookings/create/route.ts
git commit -m "Fix: Generate queue numbers sequentially per barber"
git push origin main
```

**Option B: Manual File Upload**
1. Update 3 files in your IDE
2. Upload to your hosting platform
3. Restart application

**Option C: Copy-Paste**
1. Open each file link above in raw view
2. Copy contents
3. Paste into your IDE files
4. Save and deploy

---

## 🧪 Step 4: Test the Fix

### Test in Booking Form

1. Navigate to `/book` page
2. Select a service
3. Select the same barber (e.g., "Franky")
4. Select a date and time
5. Fill in customer details
6. Click "Confirm Booking"
7. Note the queue number shown (e.g., `FN-001`)

### Create Multiple Bookings

1. Go back to booking form
2. Book again with **same barber** and **same date**
3. Fill different customer details
4. Submit
5. Note the queue number (should be `FN-002`)
6. Repeat for 3rd booking (should be `FN-003`)

✅ **If you see FN-001, FN-002, FN-003** → Fix is working!

### Check Database

Run this query in Supabase:

```sql
SELECT name, barber, datetime, queuenumber, status
FROM public.bookings
WHERE barber = 'Franky' 
  AND datetime LIKE '2026-01-15%'
ORDER BY createdat ASC;
```

**Expected output:**
```
Name   | Barber  | DateTime           | Queue    | Status
Thabo  | Franky  | 2026-01-15 15:00   | FN-001   | pending
Mandla | Franky  | 2026-01-15 15:30   | FN-002   | pending
Sipho  | Franky  | 2026-01-15 16:00   | FN-003   | pending
```

✅ Sequential queue numbers = Success!

---

## 📊 Monitoring

### Check Server Logs

Look for these log messages:

```
[Web Booking] Booking saved: { bookingId: 'RB-...', service: '...', barber: 'Franky' }

[Queue] Total bookings loaded: 3
[Queue] Generated new queue number: {
  bookingDate: '2026-01-15',
  barberName: 'franky',
  existingBookingsThatDay: 2,
  assignedQueueNumber: 'FN-003',
  ...
}

[Web Booking] Queue assigned: { bookingId: 'RB-...', queueNumber: 'FN-003' }
```

✅ These logs confirm the fix is working!

---

## 🆘 Troubleshooting

### Problem: "Column already exists" error

**Cause:** Column was already added  
**Solution:** Skip the migration, proceed to code deployment

### Problem: Queue numbers still FN-001 for all bookings

**Checklist:**
- [ ] Database has `queuenumber` column (verify with query)
- [ ] Code files updated (3 files listed above)
- [ ] Application restarted/redeployed
- [ ] Supabase credentials configured
- [ ] Check server logs for errors

### Problem: Booking fails with "Update failed"

**Cause:** Database migration didn't run completely  
**Solution:** 
1. Go back to Step 2 (Verify Migration)
2. Run the migration query again
3. Check for errors in Supabase

### Problem: Application won't start after code change

**Cause:** TypeScript errors or import issues  
**Solution:**
1. Check IDE for red errors
2. Verify all 3 files are properly updated
3. Check import statements
4. Review server logs

---

## 📝 Rollback (if needed)

### Rollback Code Changes

```bash
git revert <commit-hash>
git push origin main
```

Or manually revert the 3 files.

### Rollback Database Changes

Run in Supabase SQL Editor:

```sql
-- Remove queuenumber column
ALTER TABLE public.bookings 
DROP COLUMN IF EXISTS queuenumber CASCADE;

-- Remove indexes
DROP INDEX IF EXISTS idx_bookings_queuenumber;
DROP INDEX IF EXISTS idx_bookings_barber_datetime;
```

⚠️ **Warning:** This will lose all queue number data. Only do if absolutely necessary.

---

## ✅ Deployment Complete!

Once verified, you're done:

- ✅ Database migrated with queue support
- ✅ Code updated with new queue generation logic  
- ✅ Queue numbers now sequential per barber per day
- ✅ No more FN-001 duplicates!

---

## 📚 Related Documentation

- [DATABASE_SCHEMA_UPDATE.md](DATABASE_SCHEMA_UPDATE.md) - Full schema details
- [DATABASE_QUICK_REFERENCE.md](DATABASE_QUICK_REFERENCE.md) - Quick reference guide
- [QUEUE_FIX_SUMMARY.md](../QUEUE_FIX_SUMMARY.md) - Code changes summary
- [QUEUE_NUMBER_BUG_ANALYSIS.md](../QUEUE_NUMBER_BUG_ANALYSIS.md) - Root cause analysis

---

## 💬 Quick Recap

| Step | What | Where | Time |
|------|------|-------|------|
| 1 | Run migration SQL | Supabase SQL Editor | 1-2 min |
| 2 | Verify column exists | Supabase SQL query | 1 min |
| 3 | Deploy 3 code files | Your server | 5-10 min |
| 4 | Test booking flow | `/book` page | 5 min |
| 5 | Check logs | Server logs | 2 min |

**Total Time:** ~15 minutes ✅
