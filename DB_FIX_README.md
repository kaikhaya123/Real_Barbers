# Database Schema Fix - Booking Column Issue

## Problem
When booking on mobile, users are getting the error:
```
Error saving booking: no such column: "from" - should this be a string literal in single-quotes?
```

This is because `from` is a reserved SQL keyword in PostgreSQL, causing issues when used as a column name.

## Solution

### For Supabase Users

Run the following SQL in your Supabase SQL editor to rename the column from `"from"` to `phone`:

```sql
-- Rename the column from 'from' to 'phone'
ALTER TABLE public.bookings RENAME COLUMN "from" TO phone;

-- Drop the old index
DROP INDEX IF EXISTS idx_bookings_from;

-- Create new index with the new column name
CREATE INDEX idx_bookings_phone ON public.bookings(phone);
```

### Code Changes

The application code has been updated to:
- Use `phone` instead of `from` for storing customer phone numbers
- Update all SQL queries to reference the `phone` column
- Maintain backward compatibility by accepting both `from` and `phone` in input

## Testing

After applying the database migration:
1. Clear any local SQLite database if you have one (optional)
2. Try booking again on mobile
3. You should no longer see the "no such column" error

## Files Updated
- `/lib/supabase-bookings.ts` - Updated to use `phone` column
- `/lib/sqlite-bookings.ts` - Updated schema and queries
- `/db/supabase-migration.sql` - Updated migration script
- `/db/fix-reserved-column.sql` - Migration steps for existing databases
