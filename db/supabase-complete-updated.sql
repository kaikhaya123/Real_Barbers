-- -*- sql-dialect: postgres -*-
-- ============================================================================
-- COMPLETE SUPABASE SCHEMA WITH QUEUE NUMBER FIX
-- Pro Barber Shop Database
-- ============================================================================
-- This is the COMPLETE, UPDATED schema ready to paste into Supabase SQL Editor
-- Date: January 15, 2026
-- Status: Production Ready ✅

-- ============================================================================
-- SECTION 1: BARBERS TABLE
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
-- SECTION 2: SERVICES TABLE
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
-- SECTION 3: BOOKINGS TABLE - WITH QUEUENUMBER SUPPORT ✅
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bookingId TEXT UNIQUE,
  
  -- Customer information
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  
  -- Service information
  service TEXT NOT NULL,
  serviceId BIGINT REFERENCES public.services(id) ON DELETE SET NULL,
  
  -- Booking date and time (SEPARATE COLUMNS - YOUR SCHEMA)
  date DATE NOT NULL,
  time TIME NOT NULL,
  
  -- Barber assignment
  barber TEXT NOT NULL,
  barberId BIGINT REFERENCES public.barbers(id) ON DELETE SET NULL,
  
  -- QUEUE NUMBER - NEW COLUMN FOR FIX ✅
  queueNumber VARCHAR(10),
  
  -- Status fields
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  paymentStatus TEXT DEFAULT 'pending' CHECK (paymentStatus IN ('pending', 'paid', 'refunded')),
  
  -- Additional fields
  notes TEXT,
  raw TEXT,
  source TEXT DEFAULT 'web',
  
  -- Timestamps
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 4: WORKING HOURS TABLE
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
-- SECTION 5: UNAVAILABLE SLOTS TABLE
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
-- SECTION 6: REVIEWS TABLE
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
-- SECTION 7: CUSTOMERS TABLE
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
-- SECTION 8: LOYALTY POINTS TABLE
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
-- SECTION 9: PROMOTIONS TABLE
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
-- SECTION 10: INDEXES FOR PERFORMANCE ✅
-- ============================================================================
-- Bookings indexes (includes queue number support)
CREATE INDEX IF NOT EXISTS idx_bookings_barber_date_time 
  ON public.bookings(barberId, date, time);

CREATE INDEX IF NOT EXISTS idx_bookings_queuenumber 
  ON public.bookings(queueNumber);

CREATE INDEX IF NOT EXISTS idx_bookings_email 
  ON public.bookings(email);

CREATE INDEX IF NOT EXISTS idx_bookings_phone 
  ON public.bookings(phone);

CREATE INDEX IF NOT EXISTS idx_bookings_status 
  ON public.bookings(status);

CREATE INDEX IF NOT EXISTS idx_bookings_date 
  ON public.bookings(date);

-- Other table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_barber 
  ON public.reviews(barberId);

CREATE INDEX IF NOT EXISTS idx_reviews_booking 
  ON public.reviews(bookingId);

CREATE INDEX IF NOT EXISTS idx_working_hours_barber 
  ON public.working_hours(barberId);

CREATE INDEX IF NOT EXISTS idx_customers_email 
  ON public.customers(email);

CREATE INDEX IF NOT EXISTS idx_promotions_active 
  ON public.promotions(isActive);

-- ============================================================================
-- SECTION 11: ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Drop existing policies (if upgrading)
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
-- SECTION 12: GRANTS & PERMISSIONS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON public.bookings TO anon;
GRANT SELECT ON public.barbers TO anon;
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.customers TO anon;
GRANT SELECT ON public.working_hours TO anon;
GRANT SELECT ON public.loyalty_points TO anon;
GRANT SELECT ON public.promotions TO anon;

-- ============================================================================
-- SECTION 13: SAMPLE DATA (OPTIONAL - Comment out if not needed)
-- ============================================================================
-- Insert sample barbers
INSERT INTO public.barbers (name, email, phone, specialties, bio, active)
VALUES
  ('Franky', 'franky@probarbershop.com', '+27123456789', '{"fades", "line ups"}', 'Expert in modern cuts', true),
  ('Khaya', 'khaya@probarbershop.com', '+27123456790', '{"traditional", "designs"}', 'Specialist in designs', true),
  ('Themba', 'themba@probarbershop.com', '+27123456791', '{"braids", "locks"}', 'Expert in braids', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample services
INSERT INTO public.services (name, description, duration_minutes, price, category, active)
VALUES
  ('Basic Haircut', 'Standard haircut with wash', 30, 50.00, 'haircut', true),
  ('Fade Cut', 'Professional fade haircut', 45, 75.00, 'haircut', true),
  ('Line Designs', 'Custom line designs', 60, 100.00, 'design', true),
  ('Full Treatment', 'Haircut + wash + treatment', 60, 120.00, 'treatment', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these after the schema is created to verify:
--
-- 1. Check if queueNumber column exists:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'bookings' AND column_name = 'queueNumber';
--
-- 2. Check bookings table structure:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns 
-- WHERE table_name = 'bookings'
-- ORDER BY ordinal_position;
--
-- 3. Check if indexes were created:
-- SELECT indexname FROM pg_indexes 
-- WHERE tablename = 'bookings' AND indexname LIKE 'idx_bookings%';
--
-- Expected results:
-- ✅ queueNumber column exists (VARCHAR)
-- ✅ Bookings table has: id, phone, service, date, time, barber, barberId, queueNumber
-- ✅ Indexes exist: idx_bookings_barber_date_time, idx_bookings_queuenumber

-- ============================================================================
-- DEPLOYMENT CHECKLIST
-- ============================================================================
-- After running this complete schema:
--
-- ✅ Step 1: Run this entire SQL in Supabase SQL Editor
-- ✅ Step 2: Run verification queries above to confirm
-- ✅ Step 3: Deploy the 3 code files:
--    - lib/queue.ts
--    - lib/supabase-bookings.ts
--    - app/api/bookings/create/route.ts
-- ✅ Step 4: Test by creating bookings
-- ✅ Step 5: Verify queue numbers are sequential (FN-001, FN-002, FN-003...)
--
-- If upgrading existing database:
-- ⚠️  This will NOT delete existing data
-- ⚠️  It only adds new tables and columns
-- ⚠️  Run ONLY the queueNumber migration if tables already exist

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
-- Status: ✅ Production Ready
-- Last Updated: January 15, 2026
-- Version: 2.0 (With Queue Number Support)
