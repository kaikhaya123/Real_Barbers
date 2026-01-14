// Helper to build WhatsApp links and booking messages
export function sanitizePhone(phone: string) {
  // Remove non-digit characters
  if (!phone) return ''
  let digits = phone.replace(/[^0-9]/g, '')
  // Fix double country code mistakes like '2727...' -> '27...'
  if (digits.length > 12 && digits.startsWith('2727')) {
    digits = digits.replace(/^27+/, '27')
  }
  // If a local number like 0682188679 is given, convert to E.164 for South Africa
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
  
  // Main acknowledgement
  lines.push(`Thanks${name ? ' ' + name : ''} — we received your request for ${serviceName || 'your selected service'}.`)
  
  // Add details if provided
  if (dateTime) lines.push(`When: ${dateTime}`)
  if (barberName) lines.push(`Barber: ${barberName}`)
  
  // Add booking reference
  if (ref) lines.push(`Booking ref: ${ref}`)
  
  // Add response options
  lines.push('', 'Reply 1 to Confirm, 2 to Change, 3 to Cancel.')
  
  return lines.join('\n')
}
/**
 * Message sent when a booking is confirmed by the customer
 */
export function buildConfirmationMessage(opts: { name?: string | null; serviceName?: string | null; dateTime?: string | null; barberName?: string | null; ref?: string | null }) {
  const { name, serviceName, dateTime, barberName, ref } = opts || {}
  const lines: string[] = []
  
  lines.push(`Great${name ? ', ' + name : ''}! Your appointment has been confirmed.`)
  lines.push('')
  lines.push(`Service: ${serviceName}`)
  if (dateTime) lines.push(`Date & Time: ${dateTime}`)
  if (barberName) lines.push(`Barber: ${barberName}`)
  if (ref) lines.push(`Reference: ${ref}`)
  lines.push('')
  lines.push('See you soon! 💈')
  
  return lines.join('\n')
}

/**
 * Message sent when a barber is not available at the requested time
 */
export function buildUnavailableMessage(opts: { name?: string | null; serviceName?: string | null; barberName?: string | null; ref?: string | null }) {
  const { name, serviceName, barberName, ref } = opts || {}
  const lines: string[] = []
  
  lines.push(`Hi${name ? ' ' + name : ''},`)
  lines.push('')
  if (barberName) {
    lines.push(`Unfortunately, ${barberName} is not available at that time for ${serviceName}.`)
  } else {
    lines.push(`Unfortunately, that time slot is not available for ${serviceName}.`)
  }
  lines.push('')
  lines.push('Reply 2 to suggest a different time or date.')
  if (ref) lines.push(`Reference: ${ref}`)
  
  return lines.join('\n')
}

/**
 * Message sent when a customer requests to change their booking
 */
export function buildChangeRequestMessage(opts: { name?: string | null; ref?: string | null }) {
  const { name, ref } = opts || {}
  const lines: string[] = []
  
  lines.push(`Hi${name ? ' ' + name : ''}, what would you like to change?`)
  lines.push('')
  lines.push('Reply with:')
  lines.push('- New date and time, or')
  lines.push('- Different barber preference')
  if (ref) lines.push(``)
  lines.push(`Reference: ${ref}`)
  
  return lines.join('\n')
}

/**
 * Message sent when a booking is cancelled
 */
export function buildCancellationMessage(opts: { name?: string | null; serviceName?: string | null; ref?: string | null }) {
  const { name, serviceName, ref } = opts || {}
  const lines: string[] = []
  
  lines.push(`${name ? name + ', y' : 'Y'}our booking has been cancelled.`)
  if (serviceName) lines.push(`Service: ${serviceName}`)
  if (ref) lines.push(`Reference: ${ref}`)
  lines.push('')
  lines.push('If you change your mind, feel free to send us a new request. 😊')
  
  return lines.join('\n')
}

/**
 * Detect if incoming message is a reply (1, 2, or 3)
 */
export function detectReplyType(message: string): '1' | '2' | '3' | null {
  const trimmed = message.trim()
  if (trimmed === '1' || trimmed.toLowerCase() === 'confirm' || trimmed.toLowerCase() === 'yes') return '1'
  if (trimmed === '2' || trimmed.toLowerCase() === 'change') return '2'
  if (trimmed === '3' || trimmed.toLowerCase() === 'cancel') return '3'
  return null
}