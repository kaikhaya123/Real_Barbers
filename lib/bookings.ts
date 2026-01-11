/**
 * Bookings API - Uses Supabase for production, SQLite for local development
 * Automatically detects which to use based on environment variables
 */

// Use Supabase if configured, otherwise fall back to SQLite
const USE_SUPABASE = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

let bookingsModule: any

if (USE_SUPABASE) {
  // Production: Use Supabase
  console.log('📊 Using Supabase for bookings storage')
  bookingsModule = require('./supabase-bookings')
} else {
  // Development: Use SQLite (fallback)
  console.log('📊 Using SQLite for bookings storage (local)')
  bookingsModule = require('./sqlite-bookings')
}

export const { 
  loadBookings, 
  saveBooking, 
  findPendingBookingByPhone, 
  updateBookingStatus, 
  isBarberAvailable 
} = bookingsModule

export default bookingsModule


