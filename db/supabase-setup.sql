-- Pro Barber Shop Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql/new

-- Drop existing table if needed (CAREFUL - this deletes data!)
-- DROP TABLE IF NOT EXISTS public.bookings CASCADE;

-- Create bookings table with exact schema
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  "from" TEXT NOT NULL,
  service TEXT NOT NULL,
  name TEXT,
  dateTime TEXT,
  barber TEXT,
  raw TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  source TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_from ON public.bookings("from");
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_createdAt ON public.bookings(createdAt);
CREATE INDEX IF NOT EXISTS idx_bookings_barber ON public.bookings(barber);
CREATE INDEX IF NOT EXISTS idx_bookings_dateTime ON public.bookings(dateTime);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings (web form submissions)
CREATE POLICY "Allow public insert" ON public.bookings
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to read bookings (for checking status)
CREATE POLICY "Allow public select" ON public.bookings
  FOR SELECT 
  USING (true);

-- Allow anyone to update bookings (for admin dashboard)
CREATE POLICY "Allow public update" ON public.bookings
  FOR UPDATE 
  USING (true);

-- Grant permissions to anon user (for public access)
GRANT SELECT, INSERT, UPDATE ON public.bookings TO anon;
GRANT USAGE ON SEQUENCE public.bookings_id_seq TO anon;
