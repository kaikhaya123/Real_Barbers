-- -*- sql-dialect: postgres -*-
-- PostgreSQL/Supabase SQL (not MSSQL)
-- Migration: Create/Update bookings table with correct schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  phone TEXT,
  service TEXT NOT NULL,
  name TEXT,
  dateTime TEXT,
  barber TEXT,
  raw TEXT,
  status TEXT DEFAULT 'pending',
  source TEXT DEFAULT 'web',
  createdAt TEXT NOT NULL,
  updatedAt TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_createdAt ON public.bookings(createdAt);
CREATE INDEX IF NOT EXISTS idx_bookings_dateTime ON public.bookings(dateTime);
CREATE INDEX IF NOT EXISTS idx_bookings_barber ON public.bookings(barber);

-- Enable RLS (Row Level Security)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
