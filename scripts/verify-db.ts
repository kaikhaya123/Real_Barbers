/**
 * Database Setup Verification Script
 * Checks if SQLite database is properly initialized and shows status
 */
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'bookings.db')

console.log('🔍 Database Setup Verification\n')
console.log(`Database path: ${DB_PATH}`)
console.log(`Database exists: ${fs.existsSync(DB_PATH) ? '✅ Yes' : '❌ No'}\n`)

if (!fs.existsSync(DB_PATH)) {
  console.log('Creating new database...')
}

try {
  const db = new Database(DB_PATH)
  
  // Get table info
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  console.log(`📊 Tables: ${tables.length}`)
  tables.forEach((t: any) => console.log(`   - ${t.name}`))
  
  // Count bookings
  const bookingCount = db.prepare('SELECT COUNT(*) as cnt FROM bookings').get() as any
  console.log(`\n📋 Bookings: ${bookingCount.cnt}`)
  
  // Show recent bookings
  const recentBookings = db.prepare(`
    SELECT id, service, status, createdAt 
    FROM bookings 
    ORDER BY createdAt DESC 
    LIMIT 5
  `).all()
  
  if (recentBookings.length > 0) {
    console.log('\n📝 Recent bookings:')
    recentBookings.forEach((b: any) => {
      console.log(`   ${b.id} | ${b.service} | ${b.status} | ${new Date(b.createdAt).toLocaleString()}`)
    })
  }
  
  // Show database stats
  const dbStats = db.prepare('PRAGMA page_count').get() as any
  const pageSize = db.prepare('PRAGMA page_size').get() as any
  const sizeKB = (dbStats.page_count * pageSize.page_size) / 1024
  
  console.log(`\n💾 Database size: ${sizeKB.toFixed(2)} KB`)
  console.log('\n✅ Database is ready!')
  
  db.close()
} catch (err) {
  console.error('❌ Error:', err)
  process.exit(1)
}
