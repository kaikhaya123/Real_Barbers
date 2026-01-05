// Helper to build WhatsApp links and booking messages
export function sanitizePhone(phone: string) {
  // Remove non-digit characters
  if (!phone) return ''
  let digits = phone.replace(/[^0-9]/g, '')
  // Fix double country code mistakes like '2727...' -> '27...'
  if (digits.length > 12 && digits.startsWith('2727')) {
    digits = digits.replace(/^27+/, '27')
  }
  // If a local number like 0682770367 is given, convert to E.164 for South Africa
  if (digits.length === 10 && digits.startsWith('0')) {
    digits = '27' + digits.slice(1)
  }
  return digits
}

export function buildWhatsAppLink(phone: string, text: string) {
  const num = sanitizePhone(phone)
  const encoded = encodeURIComponent(text)
  // Use wa.me link which works on both web and mobile
  return `https://wa.me/${num}?text=${encoded}`
}

import { SERVICES } from './constants'

export function getServiceNames() {
  return SERVICES.map(s => s.name)
}

export function buildBookingMessage(opts: {
  serviceName?: string | null
  barberName?: string | null
  name?: string | null
  dateTime?: string | null
  notes?: string | null
}) {
  const { serviceName, barberName, name, dateTime, notes } = opts
  const lines: string[] = []

  if (serviceName) {
    lines.push(`Hi ${name || ''}, thanks — we received your request for: ${serviceName}`)
  } else {
    const sample = getServiceNames().slice(0, 3).join(', ')
    lines.push('Hi, welcome to Real Barbershop 👋')
    lines.push(`Which haircut or service would you like to book? e.g. ${sample}`)
  }

  lines.push('', `Name: ${name || ''}`)
  lines.push(`Preferred Date & Time: ${dateTime || ''}`)
  if (barberName) lines.push(`Preferred barber: ${barberName}`)
  if (notes) lines.push(`Notes: ${notes}`)

  lines.push('', 'Reply 1 to Confirm, 2 to Change, 3 to Cancel.')
  return lines.join('\n')
}

export function buildAckMessage(opts: { name?: string | null; serviceName: string; dateTime?: string | null; barberName?: string | null; ref?: string }) {
  const { name, serviceName, dateTime, barberName, ref } = opts
  const lines = [
    `Thanks ${name || ''} — we received your request for ${serviceName}.`,
  ]
  if (dateTime) lines.push(`When: ${dateTime}`)
  if (barberName) lines.push(`Barber: ${barberName}`)
  if (ref) lines.push(`Booking ref: ${ref}`)
  lines.push('', 'Reply 1 to Confirm, 2 to Change, 3 to Cancel.')
  return lines.join('\n')
}
