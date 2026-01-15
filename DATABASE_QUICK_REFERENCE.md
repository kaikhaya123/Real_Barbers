# 🗄️ Database Setup - Quick Reference

## What Changed?

The `bookings` table now includes a **`queuenumber`** column to store queue numbers like `FN-001`, `FN-002`, etc.

---

## 📌 For Fresh Setup (New Project)

**Use this file:** [db/supabase-setup-clean.sql](db/supabase-setup-clean.sql)

1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `db/supabase-setup-clean.sql`
3. Paste and Run
4. ✅ Done - Database ready with queue fix!

---

## 🔄 For Existing Database

**Use this file:** [db/migration-queue-fix.sql](db/migration-queue-fix.sql)

1. Open Supabase Dashboard → SQL Editor  
2. Copy entire contents of `db/migration-queue-fix.sql`
3. Paste and Run
4. ✅ Done - `queuenumber` column added!

---

## 📊 Updated Bookings Table

```sql
CREATE TABLE public.bookings (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  name TEXT,
  datetime VARCHAR(20),
  barber TEXT,
  queuenumber VARCHAR(10),              ← NEW COLUMN!
  raw TEXT,
  status TEXT DEFAULT 'pending',
  source TEXT DEFAULT 'web',
  createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedat TIMESTAMP WITH TIME ZONE
);
```

### Key Columns

| Column | Purpose | Example |
|--------|---------|---------|
| `id` | Booking ID | `RB-mk1c7lmj-8nwk7i` |
| `phone` | Customer number | `27682188679` |
| `service` | Service booked | `PROFESSIONAL HAIRCUT` |
| `barber` | Assigned barber | `Franky` |
| `datetime` | When booked | `2026-01-10 15:00` |
| **`queuenumber`** | **Queue # with initials** | **`FN-001`** |
| `status` | State of booking | `pending`, `confirmed`, `completed`, `cancelled` |
| `createdat` | Created timestamp | `2026-01-15T10:30:00Z` |

---

## ✅ Verification

After running migration, verify the column exists:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' AND column_name = 'queuenumber';
```

Should show: `queuenumber | character varying`

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| [db/supabase-setup-clean.sql](db/supabase-setup-clean.sql) | Complete fresh database schema |
| [db/migration-queue-fix.sql](db/migration-queue-fix.sql) | Add queuenumber to existing database |
| [DATABASE_SCHEMA_UPDATE.md](DATABASE_SCHEMA_UPDATE.md) | Detailed schema documentation |
| [QUEUE_FIX_SUMMARY.md](QUEUE_FIX_SUMMARY.md) | Code changes summary |

---

## 💡 How Queue Numbers Work

**Booking 1 for Franky on 2026-01-15:**
- Saves to DB
- Checks: How many Franky bookings on 2026-01-15? → 0
- Generates: `001`
- Formats with initials: **`FN-001`**

**Booking 2 for Franky on 2026-01-15:**
- Saves to DB
- Checks: How many Franky bookings on 2026-01-15? → 1 (prev booking)
- Generates: `002`
- Formats: **`FN-002`**

**Booking 3 for Franky on 2026-01-15:**
- Saves to DB
- Checks: How many Franky bookings on 2026-01-15? → 2 (prev bookings)
- Generates: `003`
- Formats: **`FN-003`**

✅ **Sequential queue numbers per barber per day!**

---

## 🆘 Need Help?

1. ✅ Database file updated? → Check [db/supabase-setup-clean.sql](db/supabase-setup-clean.sql)
2. ✅ Migration applied? → Check [db/migration-queue-fix.sql](db/migration-queue-fix.sql)
3. ✅ Code updated? → Check [QUEUE_FIX_SUMMARY.md](QUEUE_FIX_SUMMARY.md)
4. ✅ Full schema docs? → Check [DATABASE_SCHEMA_UPDATE.md](DATABASE_SCHEMA_UPDATE.md)
