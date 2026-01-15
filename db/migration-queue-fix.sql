-- -*- sql-dialect: postgres -*-
-- Queue Number Fix Migration for Your Existing Supabase Database
-- Customized for Pro Barber Shop schema
-- Date: January 15, 2026

-- ============================================================================
-- MIGRATION: Add queueNumber support to existing bookings table
-- ============================================================================
-- This migration adds queue number functionality to your existing schema
-- Safe: Only adds column and indexes, doesn't modify existing data
-- Use this if you have an EXISTING database

-- Step 1: Add queueNumber column if it doesn't exist
ALTER TABLE IF EXISTS public.bookings
ADD COLUMN IF NOT EXISTS queueNumber VARCHAR(10);

-- Step 2: Create index for queue number lookups
CREATE INDEX IF NOT EXISTS idx_bookings_queuenumber 
ON public.bookings(queueNumber);

-- Step 3: Create composite index for barber + date/time lookups
-- This is used by the queue generation logic to find existing bookings
CREATE INDEX IF NOT EXISTS idx_bookings_barber_date_time 
ON public.bookings(barberId, date, time);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this after migration to confirm success:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'bookings' AND column_name = 'queueNumber';
--
-- Expected result: queueNumber | character varying

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================
-- To undo this migration, run:
-- ALTER TABLE public.bookings DROP COLUMN IF EXISTS queueNumber CASCADE;
-- DROP INDEX IF EXISTS idx_bookings_queuenumber;
-- DROP INDEX IF EXISTS idx_bookings_barber_date_time;
