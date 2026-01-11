#!/usr/bin/env node
/**
 * Test script to verify Supabase integration is working
 */

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🧪 Testing Supabase Integration...\n')

if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL not found in .env.local')
  process.exit(1)
}

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
  process.exit(1)
}

console.log('✅ Supabase credentials found')
console.log(`   URL: ${supabaseUrl}`)
console.log(`   Key: ${supabaseKey.slice(0, 20)}...`)

// Test connection
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n📡 Testing database connection...')
    const { data, error, count } = await supabase.from('bookings').select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Database query failed:', error)
      process.exit(1)
    }

    console.log('✅ Database connection successful')
    console.log(`   Total bookings in database: ${count || 0}`)

    // Test insert
    console.log('\n📝 Testing insert operation...')
    const bookingId = `RB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()
    const testBooking = {
      id: bookingId,
      from: '+27123456789',
      service: 'Fade',
      name: 'Test User',
      status: 'pending',
      source: 'test',
      createdat: now,  // PostgreSQL lowercased the camelCase
    }

    const { data: insertedData, error: insertError } = await supabase
      .from('bookings')
      .insert([testBooking])
      .select()

    if (insertError) {
      console.error('❌ Insert failed:', insertError)
      process.exit(1)
    }

    console.log('✅ Insert operation successful')
    console.log(`   Test booking created with ID: ${insertedData?.[0]?.id}`)

    // Test select
    console.log('\n📖 Testing select operation...')
    const { data: bookings, error: selectError } = await supabase
      .from('bookings')
      .select('*')
      .eq('from', '+27123456789')
      .order('createdat', { ascending: false })

    if (selectError) {
      console.error('❌ Select failed:', selectError)
      process.exit(1)
    }

    console.log('✅ Select operation successful')
    console.log(`   Found ${bookings?.length || 0} bookings for test number`)

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...')
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('from', '+27123456789')

    if (deleteError) {
      console.warn('⚠️  Could not delete test data:', deleteError)
    } else {
      console.log('✅ Test data cleaned up')
    }

    console.log('\n✅ All tests passed! Supabase integration is working correctly.\n')
  } catch (err) {
    console.error('❌ Test failed:', err)
    process.exit(1)
  }
}

testConnection()
