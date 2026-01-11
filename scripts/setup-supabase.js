/**
 * Supabase Table Setup Script
 * Run this once to create the bookings table
 * node scripts/setup-supabase.js
 */
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing\n')

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...\n')

  try {
    // Create bookings table
    const { error } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bookings (
          id TEXT PRIMARY KEY,
          "from" TEXT NOT NULL,
          service TEXT NOT NULL,
          name TEXT,
          dateTime TEXT,
          barber TEXT,
          raw TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          source TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_bookings_from ON bookings("from");
        CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
        CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(createdAt);
      `,
    })

    if (error) {
      // Try alternative approach using SQL editor
      console.log('ℹ️  Using alternative setup method...')
      console.log('\n📝 Please run this SQL in Supabase SQL Editor:')
      console.log(`
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  "from" TEXT NOT NULL,
  service TEXT NOT NULL,
  name TEXT,
  dateTime TEXT,
  barber TEXT,
  raw TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  source TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_from ON bookings("from");
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(createdAt);
      `)
      console.log('\n✅ Copy the SQL above into Supabase SQL Editor')
      process.exit(0)
    }

    console.log('✅ Bookings table created successfully!')

    // Check if table exists
    const { data, error: checkError } = await supabase
      .from('bookings')
      .select('count')
      .limit(1)

    if (checkError) {
      console.error('⚠️  Warning:', checkError.message)
    } else {
      console.log('✅ Table is accessible and ready!')
    }

    console.log('\n🎉 Database setup complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Setup failed:', err)
    process.exit(1)
  }
}

setupDatabase()
