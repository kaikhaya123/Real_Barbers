import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const DATA_DIR = path.join(process.cwd(), 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)

const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'bookings.db')
const db = new Database(DB_PATH)

export function initDb() {
  // Create tables if not exist (idempotent)
  db.exec(`
    CREATE TABLE IF NOT EXISTS barbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      service TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      barber TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );
  `)
}

initDb()

export interface Booking {
  id: string
  name: string
  service: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  barber: string
  status?: string
  created_at?: string
}

export function isSlotAvailable(barber: string, date: string, time: string) {
  const row = db.prepare(
    `SELECT COUNT(1) as cnt FROM bookings WHERE barber = ? AND date = ? AND time = ? AND status IN ('pending','confirmed')`
  ).get(barber, date, time)
  return row.cnt === 0
}

export function createBooking(b: Booking) {
  const stmt = db.prepare(
    `INSERT INTO bookings (id,name,service,date,time,barber,status,created_at) VALUES (?,?,?,?,?,?,?,?)`
  )
  const now = new Date().toISOString()
  stmt.run(b.id, b.name, b.service, b.date, b.time, b.barber, b.status || 'pending', b.created_at || now)
  return getBookingById(b.id)
}

export function getBookingById(id: string) {
  return db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(id)
}

export function getUpcomingBookings(sinceISO: string) {
  return db.prepare(`SELECT * FROM bookings WHERE datetime(created_at) >= datetime(?) ORDER BY date,time`).all(sinceISO)
}

export function listBookingsOn(barber: string, date: string) {
  return db.prepare(`SELECT * FROM bookings WHERE barber = ? AND date = ? ORDER BY time`).all(barber, date)
}

export default db
