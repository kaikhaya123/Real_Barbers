/**
 * Bookings API - Uses Supabase for production
 */

// Import Supabase bookings module
const bookingsModule = require('./supabase-bookings')

export const { 
  loadBookings, 
  saveBooking, 
  findPendingBookingByPhone, 
  updateBookingStatus, 
  isBarberAvailable 
} = bookingsModule

export default bookingsModule


