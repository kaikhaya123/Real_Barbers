import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'bookings.json')

async function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]')
}

export async function loadBookings() {
  await ensureFile()
  const raw = fs.readFileSync(FILE, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

export async function saveBooking(input: Record<string, any>) {
  await ensureFile()
  const bookings = await loadBookings()
  const id = `RB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`
  const booking = { id, createdAt: new Date().toISOString(), ...input }
  bookings.push(booking)
  fs.writeFileSync(FILE, JSON.stringify(bookings, null, 2))
  return booking
}

export default { loadBookings, saveBooking }
