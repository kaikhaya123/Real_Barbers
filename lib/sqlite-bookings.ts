import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { SERVICES } from './constants'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'bookings.db')

// Initialize database if not exists
function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function getDb() {
  ensureDb()
  const db = new Database(DB_PATH)
  
  // Create tables if not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      phone TEXT NOT NULL,
      service TEXT NOT NULL,
      name TEXT,
      datetime TEXT,
      barber TEXT,
      raw TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      source TEXT,
      createdat TEXT NOT NULL,
      updatedat TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(createdat);
  `)
  
  return db
}

export async function loadBookings() {
  const db = getDb()
  try {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY createdAt DESC').all()
    return bookings
  } finally {
    db.close()
  }
}

export async function saveBooking(input: Record<string, any>) {
  const db = getDb()
  try {
    const id = `RB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()
    
    const booking: Record<string, any> = {
      id,
      createdAt: now,
      ...input,
    }

    const stmt = db.prepare(`
      INSERT INTO bookings (id, phone, service, name, datetime, barber, raw, status, source, createdat, updatedat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      booking.id,
      booking.phone || booking.from || '',
      booking.service || '',
      booking.name || null,
      booking.datetime || null,
      booking.barber || null,
      booking.raw || null,
      booking.status || 'pending',
      booking.source || 'twilio',
      booking.createdat,
      null
    )

    return booking
  } finally {
    db.close()
  }
}

/**
 * Find the most recent pending booking from a customer phone number
 */
export async function findPendingBookingByPhone(phone: string) {
  const db = getDb()
  try {
    const booking = db.prepare(`
      SELECT * FROM bookings 
      WHERE phone = ? AND status = 'pending' 
      ORDER BY createdAt DESC 
      LIMIT 1
    `).get(phone)
    
    return booking || null
  } finally {
    db.close()
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
  const db = getDb()
  try {
    const now = new Date().toISOString()
    
    db.prepare(`
      UPDATE bookings 
      SET status = ?, updatedat = ? 
      WHERE id = ?
    `).run(status, now, bookingId)
    
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId)
    return booking || null
  } finally {
    db.close()
  }
}

/**
 * Check if a barber is available at a given date/time
 * Assumes bookings have dateTime in format "YYYY-MM-DD HH:MM"
 */
export async function isBarberAvailable(barberId: string | null | undefined, dateTime: string, serviceDuration: number = 60) {
  if (!barberId) return true // If no barber preference, always available
  
  const db = getDb()
  try {
    const service = SERVICES.find((s: any) => s.duration)
    const duration = serviceDuration || 60 // minutes
    
    const requestedStart = new Date(`${dateTime}:00`)
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000)
    
    // Check for conflicts with confirmed/completed bookings
    const conflicts = db.prepare(`
      SELECT * FROM bookings 
      WHERE barber = ? AND status IN ('confirmed', 'completed') AND datetime IS NOT NULL
    `).all(barberId)
    
    const hasConflict = conflicts.some((b: any) => {
      const existingStart = new Date(`${b.datetime}:00`)
      const existingService = SERVICES.find((s: any) => s.name === b.service)
      const existingDuration = existingService?.duration || 60
      const existingEnd = new Date(existingStart.getTime() + existingDuration * 60000)
      
      // Check if there's any overlap
      return requestedStart < existingEnd && requestedEnd > existingStart
    })
    
    return !hasConflict
  } finally {
    db.close()
  }
}

export default { loadBookings, saveBooking, findPendingBookingByPhone, updateBookingStatus, isBarberAvailable }
