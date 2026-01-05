/**
 * Simple reminder runner for local development.
 * Scans bookings and logs reminders for appointments happening within next 24h.
 * In production, replace the log with provider send (Twilio/Meta).
 */
const path = require('path')
const db = require(path.join(process.cwd(), 'lib', 'db')).default

function isoNow() { return new Date().toISOString() }

function run() {
  // For simple demo, fetch all bookings and filter by date
  const now = new Date()
  const in24 = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const rows = db.prepare(`SELECT * FROM bookings WHERE status = 'confirmed'`).all()
  rows.forEach(r => {
    const appt = new Date(r.date + 'T' + r.time + ':00')
    if (appt > now && appt <= in24) {
      console.log(`[REMINDER] To: ${r.name} — Appointment for ${r.service} with ${r.barber} on ${r.date} at ${r.time}`)
    }
  })
}

run()
