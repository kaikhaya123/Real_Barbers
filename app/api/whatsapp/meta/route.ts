import { sendMetaMessage } from '@/lib/whatsappClient'
import { buildAckMessage } from '@/lib/whatsapp'
import { parseBookingFields, findServiceByText, normalizePhoneForStorage } from '@/lib/whatsappUtils'
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

    const parsed = parseBookingFields(text)
    const matched = parsed.service ? findServiceByText(parsed.service) : null
    const serviceName = matched ? matched.name : parsed.service || 'your selected service'

    const booking = await saveBooking({
      source: 'meta',
      from: normalizePhoneForStorage(from),
      service: serviceName,
      name: parsed.name || undefined,
      dateTime: parsed.dateTime || undefined,
      barber: parsed.barber || undefined,
      raw: text,
      status: 'pending',
    })

    const ack = buildAckMessage({ name: parsed.name, serviceName, dateTime: parsed.dateTime, barberName: parsed.barber, ref: booking.id })

    await sendMetaMessage(from, ack)

    return new Response('OK')
  } catch (err) {
    return new Response('error', { status: 500 })
  }
}
