const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(process.cwd(), 'data')
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json')
const OUT_FILE = path.join(DATA_DIR, 'outgoing.json')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(BOOKINGS_FILE)) fs.writeFileSync(BOOKINGS_FILE, '[]')
if (!fs.existsSync(OUT_FILE)) fs.writeFileSync(OUT_FILE, '[]')

function sanitizePhone(phone) {
  if (!phone) return ''
  let digits = phone.replace(/[^0-9]/g, '')
  if (digits.length === 10 && digits.startsWith('0')) digits = '27' + digits.slice(1)
  if (digits.startsWith('2727')) digits = digits.replace(/^27+/, '27')
  return digits
}

function parseBooking(text) {
  const t = (text || '').replace(/\r/g, ' ').replace(/\n+/g, '\n')
  const serviceMatch = t.match(/Service[:\-]\s*([^;\n]+)/i)
  const nameMatch = t.match(/Name[:\-]\s*([^;\n]+)/i)
  const dateMatch = t.match(/(Date|When|Time)[:\-]\s*([^;\n]+)/i)
  const barberMatch = t.match(/Barber[:\-]\s*([^;\n]+)/i)
  return {
    service: serviceMatch ? serviceMatch[1].trim() : undefined,
    name: nameMatch ? nameMatch[1].trim() : undefined,
    dateTime: dateMatch ? dateMatch[2].trim() : undefined,
    barber: barberMatch ? barberMatch[1].trim() : undefined,
  }
}

const from = '+27682770367'
const body = 'Service: PLAIN FADE\nName: Thabo\nDate: 2026-01-10 15:00'

const parsed = parseBooking(body)

const bookingsRaw = fs.readFileSync(BOOKINGS_FILE, 'utf8')
const bookings = JSON.parse(bookingsRaw || '[]')
const id = `RB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`
const booking = {
  id,
  createdAt: new Date().toISOString(),
  source: 'twilio-dry',
  from: sanitizePhone(from),
  service: parsed.service || 'unknown',
  name: parsed.name || null,
  dateTime: parsed.dateTime || null,
  barber: parsed.barber || null,
  raw: body,
  status: 'pending',
}
bookings.push(booking)
fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))

const ack = []
ack.push(`Thanks ${parsed.name || ''} — we received your request for ${parsed.service || 'your selected service'}.`)
if (parsed.dateTime) ack.push(`When: ${parsed.dateTime}`)
if (parsed.barber) ack.push(`Barber: ${parsed.barber}`)
ack.push(`Booking ref: ${id}`)
ack.push('')
ack.push('Reply 1 to Confirm, 2 to Change, 3 to Cancel.')
const ackMessage = ack.join('\n')

const outRaw = fs.readFileSync(OUT_FILE, 'utf8')
const out = JSON.parse(outRaw || '[]')
out.push({ provider: 'twilio-dry', to: sanitizePhone(from), body: ackMessage, createdAt: new Date().toISOString() })
fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2))

console.log('Simulated webhook: booking saved and ack written.')
console.log('Booking ID:', id)
