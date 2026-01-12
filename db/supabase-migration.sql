-- Migration: Create/Update bookings table with correct schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  phone TEXT,
  service TEXT NOT NULL,
  name TEXT,
  datetime TEXT,
  barber TEXT,
  raw TEXT,
  status TEXT DEFAULT 'pending',
  source TEXT DEFAULT 'web',
  createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedat TIMESTAMP WITH TIME ZONE,
  email TEXT
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings(createdat);
CREATE INDEX IF NOT EXISTS idx_bookings_datetime ON public.bookings(datetime);
CREATE INDEX IF NOT EXISTS idx_bookings_barber ON public.bookings(barber);

-- Enable RLS (Row Level Security)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public select/insert (update policy if needed)
CREATE POLICY "Allow public insert" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON public.bookings
  FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON public.bookings
  FOR UPDATE USING (true);
