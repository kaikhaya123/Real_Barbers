/**
 * Migration script: Move bookings from JSON files to SQLite database
 * Run with: npx ts-node scripts/migrate-to-db.ts
 */
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'bookings.db')
const BOOKINGS_JSON = path.join(DATA_DIR, 'bookings.json')

// Initialize database
const db = new Database(DB_PATH)

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      from TEXT NOT NULL,
      service TEXT NOT NULL,
      name TEXT,
      dateTime TEXT,
      barber TEXT,
      raw TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      source TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_bookings_from ON bookings(from);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(createdAt);
  `)
  console.log('✅ Database schema initialized')
}

function migrateBookings() {
  if (!fs.existsSync(BOOKINGS_JSON)) {
    console.log('ℹ️  No bookings.json found, skipping migration')
    return
  }

  try {
    const raw = fs.readFileSync(BOOKINGS_JSON, 'utf8')
    const bookings = JSON.parse(raw || '[]')
    
    if (bookings.length === 0) {
      console.log('ℹ️  No bookings to migrate')
      return
    }

    // Insert bookings into database
    const insert = db.prepare(`
      INSERT INTO bookings (id, from, service, name, dateTime, barber, raw, status, source, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const transaction = db.transaction((items: any[]) => {
      for (const booking of items) {
        insert.run(
          booking.id,
          booking.from,
          booking.service,
          booking.name || null,
          booking.dateTime || null,
          booking.barber || null,
          booking.raw || null,
          booking.status || 'pending',
          booking.source || 'twilio',
          booking.createdAt,
          null
        )
      }
    })

    transaction(bookings)
    console.log(`✅ Migrated ${bookings.length} bookings to database`)
  } catch (err) {
    console.error('❌ Migration failed:', err)
    throw err
  }
}

function main() {
  console.log('🚀 Starting migration to SQLite...')
  initDb()
  migrateBookings()
  console.log('✅ Migration complete!')
  process.exit(0)
}

main()
