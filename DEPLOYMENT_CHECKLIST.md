# ✅ Deployment Checklist - Queue Number Fix

## 📋 Overview
This checklist guides you through deploying the queue number fix to your barbershop booking system. The fix changes queue numbers from being duplicated (all FN-001) to sequential (FN-001, FN-002, FN-003).

---

## 🔧 Phase 1: Database Migration (1-2 minutes)

### Step 1.1: Access Supabase SQL Editor
- [ ] Go to Supabase dashboard
- [ ] Select your database
- [ ] Click **SQL Editor** in sidebar
- [ ] Click **New Query**

### Step 1.2: Run Migration
- [ ] Open [db/migration-queue-fix.sql](db/migration-queue-fix.sql)
- [ ] Copy **ALL** contents
- [ ] Paste into Supabase SQL Editor
- [ ] Click **Run** button
- [ ] ✅ Should show: "No rows affected" or "Success"

### Step 1.3: Verify Migration Success
- [ ] Run this verification query:
```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'bookings' AND column_name = 'queueNumber';
```
- [ ] Should return: `queueNumber | character varying` (or `varchar`)
- [ ] If not found, migration failed - check error messages

---

## 💻 Phase 2: Deploy Code Files (5 minutes)

### Step 2.1: File Locations
Your 3 updated files are in the workspace:

| File | Path | Status |
|------|------|--------|
| Queue generation logic | `lib/queue.ts` | ✅ Updated |
| Supabase adapter | `lib/supabase-bookings.ts` | ✅ Updated |
| Booking API endpoint | `app/api/bookings/create/route.ts` | ✅ Updated |

### Step 2.2: Deploy to Server
- [ ] Push these 3 files to your server/repo:
  - [ ] `lib/queue.ts`
  - [ ] `lib/supabase-bookings.ts`
  - [ ] `app/api/bookings/create/route.ts`
- [ ] Rebuild/restart your Next.js application
- [ ] Wait for deployment to complete

### Step 2.3: Verify Deployment
- [ ] Check server logs for errors
- [ ] No TypeScript compilation errors
- [ ] Application loads without crashes

---

## 🧪 Phase 3: Testing (5-10 minutes)

### Test Case 1: Single Booking
- [ ] Create a booking for **Barber: Franky, Date: Today**
- [ ] Check queue number received: Should be `FN-001` ✓

### Test Case 2: Sequential Numbers (Same Barber)
- [ ] Create 3 bookings for **same barber, same date**
- [ ] Check queue numbers:
  - [ ] Booking 1: `FN-001` ✓
  - [ ] Booking 2: `FN-002` ✓ (NOT `FN-001` again!)
  - [ ] Booking 3: `FN-003` ✓

### Test Case 3: Different Barbers (Same Day)
- [ ] Create bookings for different barbers on same date:
  - [ ] Franky booking: `FN-001` ✓
  - [ ] Khaya booking: `KH-001` ✓ (different counter)
  - [ ] Franky booking 2: `FN-002` ✓ (continues Franky's sequence)

### Test Case 4: Different Days
- [ ] Create bookings for same barber on different dates:
  - [ ] Today: `FN-001` ✓
  - [ ] Tomorrow: `FN-001` ✓ (resets daily)

### Test Case 5: Confirmation Delivery
- [ ] Verify confirmation received via:
  - [ ] ✓ Email (if email provided)
  - [ ] ✓ WhatsApp (if phone provided)
- [ ] Confirmation should show correct queue number

---

## 📊 Phase 4: Database Verification (2 minutes)

### Step 4.1: Query Recent Bookings
Run this query in Supabase SQL Editor:

```sql
SELECT 
  name,
  barber,
  date,
  time,
  queueNumber,
  status,
  createdAt
FROM bookings
WHERE date = '2024-01-15'  -- Change to today's date
ORDER BY createdAt ASC;
```

### Step 4.2: Verify Results
- [ ] All bookings for same barber have different queue numbers
- [ ] Numbers are sequential (001, 002, 003...)
- [ ] Different barbers have different counters

---

## 🚨 Troubleshooting

### Issue: "queueNumber column not found"
**Solution:** Migration didn't run. Go back to Phase 1 and verify:
- [ ] Migration SQL was copied completely
- [ ] Query executed without errors
- [ ] Column exists in database

### Issue: Queue numbers still duplicated
**Solution:** Code files not deployed. Verify:
- [ ] All 3 files were uploaded to server
- [ ] Application restarted after deployment
- [ ] Server logs show no errors

### Issue: Bookings not saving
**Solution:** Schema mismatch. Check:
- [ ] Your `bookings` table has: `date`, `time`, `barberId`, `queueNumber`
- [ ] Column names match exactly (camelCase)
- [ ] Run migration to add missing columns

### Issue: Missing column errors in logs
**Solution:** Your table structure differs. Contact support with:
- [ ] Error message from logs
- [ ] Your actual `bookings` table structure
- [ ] List of column names in your table

---

## ✨ What Changed

### Before (Broken)
```
Booking 1 → Generate queue (DB empty) → count=0 → FN-001 ✓
Booking 2 → Generate queue (DB still empty) → count=0 → FN-001 ❌ DUPLICATE
Booking 3 → Generate queue (DB still empty) → count=0 → FN-001 ❌ DUPLICATE
```

### After (Fixed)
```
Booking 1 → Save to DB → Generate queue (count=0) → FN-001 ✓
Booking 2 → Save to DB → Generate queue (count=1) → FN-002 ✓
Booking 3 → Save to DB → Generate queue (count=2) → FN-003 ✓
```

---

## 📞 Support

If you encounter issues:
1. Check **Troubleshooting** section above
2. Review server logs for error messages
3. Verify all 3 code files are deployed
4. Confirm database migration was successful

---

## 📝 Deployment Log

| Phase | Task | Status | Time | Notes |
|-------|------|--------|------|-------|
| 1 | Database Migration | ⬜ | - | Copy & run migration SQL |
| 2 | Code Deployment | ⬜ | - | Deploy 3 files |
| 3 | Testing | ⬜ | - | Run all 5 test cases |
| 4 | Verification | ⬜ | - | Query database to confirm |

---

**Last Updated:** 2024  
**Status:** Ready for deployment ✅
