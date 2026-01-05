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

// Keep helpers minimal for the UI button: build a simple default message
export function buildBookingMessage(opts: { barberName?: string | null; name?: string | null; serviceName?: string | null; dateTime?: string | null; notes?: string | null }) {
  const { barberName, name, serviceName, dateTime, notes } = opts || {}
  const lines: string[] = []
  lines.push(`Hi${name ? ' ' + name : ''} — I'd like to book an appointment${serviceName ? ' for ' + serviceName : ''}.`)
  if (barberName) lines.push(`Preferred barber: ${barberName}`)
  if (dateTime) lines.push(`Preferred time: ${dateTime}`)
  if (notes) {
    lines.push('', 'Notes:', notes)
  }
  lines.push('', 'Please let me know available slots. Thanks!')
  return lines.join('\n')
}

export function buildAckMessage(opts: { name?: string | null; serviceName?: string | null; dateTime?: string | null; barberName?: string | null; ref?: string | null }) {
  const { name, serviceName, dateTime, barberName, ref } = opts || {}
  const lines: string[] = []
  lines.push(`Thanks${name ? ' ' + name : ''} — we received your request for ${serviceName || 'your selected service'}.`)
  if (dateTime) lines.push(`When: ${dateTime}`)
  if (barberName) lines.push(`Barber: ${barberName}`)
  if (ref) lines.push(`Booking ref: ${ref}`)
  lines.push('', 'Reply 1 to Confirm, 2 to Change, 3 to Cancel.')
  return lines.join('\n')
}
