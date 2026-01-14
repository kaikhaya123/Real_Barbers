-- Fix for reserved keyword 'from' in bookings table
-- This migration renames the 'from' column to 'phone' to avoid PostgreSQL reserved keyword issues

-- Rename the column
ALTER TABLE public.bookings RENAME COLUMN "from" TO phone;

-- Drop the old index
DROP INDEX IF EXISTS idx_bookings_from;

-- Create new index
CREATE INDEX idx_bookings_phone ON public.bookings(phone);

-- Update RLS policies if they reference the old column name
-- (Adjust based on your specific RLS policies)
