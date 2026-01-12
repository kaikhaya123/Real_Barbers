import { 
  parseBookingFields, 
  findServiceByText, 
  normalizePhoneForStorage 
} from '@/lib/whatsappUtils'
import { saveBooking } from '@/lib/bookings'

export async function POST(req: Request) {
  try {
    const payload = await req.json()

    // WhatsApp Cloud webhook structure: entry[].changes[].value.messages[]
    const entries = Array.isArray(payload.entry) ? payload.entry : []
    let from = ''
    let text = ''

    for (const e of entries) {
      const changes = e.changes || []
      for (const c of changes) {
        const value = c.value || {}
        const messages = Array.isArray(value.messages) ? value.messages : []
        for (const m of messages) {
          from = m.from || from
          if (m.text && m.text.body) text = m.text.body
        }
      }
    }

    if (!from || !text) return new Response('no message', { status: 200 })

    console.log('[Meta Webhook] Incoming message:', { from, body: text.substring(0, 50) })

    const normalizedFrom = normalizePhoneForStorage(from)
    
    // Parse and save booking to database (no auto-reply)
    const parsed = parseBookingFields(text)
    const matched = parsed.service ? findServiceByText(parsed.service) : null
    const serviceName = matched ? matched.name : parsed.service || 'appointment'

    const booking = await saveBooking({
      source: 'meta',
      from: normalizedFrom,
      service: serviceName,
      name: parsed.name || undefined,
      datetime: parsed.dateTime || undefined,
      barber: parsed.barber || undefined,
      raw: text,
      status: 'pending',
    })

    console.log('[Meta Webhook] Booking saved:', { bookingId: booking.id, from: normalizedFrom, service: serviceName })

    return new Response('OK')
  } catch (err) {
    console.error('Meta webhook error:', err)
    // Always return a response, even on error
    return new Response('OK', { status: 200 })
  }
}
