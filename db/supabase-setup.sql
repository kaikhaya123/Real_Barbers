-- -*- sql-dialect: postgres -*-
-- PostgreSQL/Supabase SQL - Pro Barber Shop Database Schema
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql/new

-- DROP old tables if they exist (CAUTION: this deletes all data)
-- DROP TABLE IF EXISTS public.loyalty_points CASCADE;
-- DROP TABLE IF EXISTS public.promotions CASCADE;
-- DROP TABLE IF EXISTS public.customers CASCADE;
-- DROP TABLE IF EXISTS public.reviews CASCADE;
-- DROP TABLE IF EXISTS public.unavailable_slots CASCADE;
-- DROP TABLE IF EXISTS public.working_hours CASCADE;
-- DROP TABLE IF EXISTS public.bookings CASCADE;
-- DROP TABLE IF EXISTS public.services CASCADE;
-- DROP TABLE IF EXISTS public.barbers CASCADE;

-- ============================================================================
-- BARBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.barbers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialties TEXT[],
  bio TEXT,
  photo_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SERVICES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL,
  category TEXT DEFAULT 'haircut',
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bookingId TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  serviceId BIGINT REFERENCES public.services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  barber TEXT NOT NULL,
  barberId BIGINT REFERENCES public.barbers(id) ON DELETE SET NULL,
  queueNumber TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  paymentStatus TEXT DEFAULT 'pending' CHECK (paymentStatus IN ('pending', 'paid', 'refunded')),
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- WORKING HOURS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.working_hours (
  id BIGSERIAL PRIMARY KEY,
  barberId BIGINT NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- UNAVAILABLE SLOTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.unavailable_slots (
  id BIGSERIAL PRIMARY KEY,
  barberId BIGINT NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGSERIAL PRIMARY KEY,
  bookingId UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  customerName TEXT NOT NULL,
  customerEmail TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  barberId BIGINT NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bookingId)
);

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  totalVisits INTEGER DEFAULT 0,
  totalSpent DECIMAL(10,2) DEFAULT 0,
  preferredBarberId BIGINT REFERENCES public.barbers(id) ON DELETE SET NULL,
  preferredServiceId BIGINT REFERENCES public.services(id) ON DELETE SET NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- LOYALTY POINTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id BIGSERIAL PRIMARY KEY,
  customerId BIGINT NOT NULL UNIQUE REFERENCES public.customers(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  lastRedemption TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PROMOTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.promotions (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discountType TEXT CHECK (discountType IN ('percentage', 'fixed_amount')),
  discountValue DECIMAL(10,2) NOT NULL,
  code TEXT UNIQUE,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  isActive BOOLEAN DEFAULT true,
  minBookingValue DECIMAL(10,2),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_barber_date_time ON public.bookings(barberId, date, time);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_queue ON public.bookings(queueNumber);
CREATE INDEX IF NOT EXISTS idx_reviews_barber ON public.reviews(barberId);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON public.reviews(bookingId);
CREATE INDEX IF NOT EXISTS idx_working_hours_barber ON public.working_hours(barberId);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON public.promotions(isActive);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - DROP OLD POLICIES FIRST
-- ============================================================================
DROP POLICY IF EXISTS "Allow public insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public select bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public select services" ON public.services;
DROP POLICY IF EXISTS "Allow public select barbers" ON public.barbers;
DROP POLICY IF EXISTS "Allow public select reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public insert customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public select customers" ON public.customers;

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Allow public insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select bookings" ON public.bookings
  FOR SELECT USING (true);

CREATE POLICY "Allow public update bookings" ON public.bookings
  FOR UPDATE USING (true);

-- Services policies
CREATE POLICY "Allow public select services" ON public.services
  FOR SELECT USING (active = true);

-- Barbers policies
CREATE POLICY "Allow public select barbers" ON public.barbers
  FOR SELECT USING (active = true);

-- Reviews policies
CREATE POLICY "Allow public select reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Customers policies
CREATE POLICY "Allow public insert customers" ON public.customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select customers" ON public.customers
  FOR SELECT USING (true);

-- ============================================================================
-- GRANTS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON public.bookings TO anon;
GRANT SELECT ON public.barbers TO anon;
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.customers TO anon;
GRANT SELECT ON public.working_hours TO anon;
GRANT SELECT ON public.loyalty_points TO anon;
GRANT SELECT ON public.promotions TO anon;
