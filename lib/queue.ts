import { loadBookings } from './bookings'

/**
 * Booking object from database
 */
interface DbBooking {
  id: string
  from: string
  service: string
  datetime: string
  barber: string
  name: string
  raw: string
  status: string
  source: string
  createdat: string
  updatedat?: string
}

/**
 * Generate a queue number for a booking based on:
 * - Booking date
 * - Barber assigned
 * - Sequential count of bookings for that date/barber
 * 
 * Example: 001, 002, 003, etc.
 */
export async function generateQueueNumber(bookingDate: string, barberName: string): Promise<string> {
  try {
    const bookings = await loadBookings() as DbBooking[]
    
    // Get bookings for the same date and barber
    const sameDay = bookings.filter((b: DbBooking) => {
      const bookingDateOnly = b.datetime?.split(' ')[0] // Get YYYY-MM-DD part
      return bookingDateOnly === bookingDate && b.barber === barberName
    })
    
    // Queue number is count + 1, padded to 3 digits
    const queueNumber = sameDay.length + 1
    return String(queueNumber).padStart(3, '0')
  } catch (err) {
    console.error('[Queue] Error generating queue number:', err)
    // Fallback to timestamp-based number
    return String(Date.now() % 1000).padStart(3, '0')
  }
}

/**
 * Format a queue number with barber initials
 * Example: "KF-001" for "Khaya" barber
 */
export function formatQueueDisplay(queueNumber: string, barberName?: string): string {
  if (!barberName) return queueNumber
  
  const initials = barberName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
  
  return `${initials}-${queueNumber}`
}
