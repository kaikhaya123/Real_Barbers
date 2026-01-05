import { sendTwilioMessage } from '@/lib/whatsappClient'
import { buildAckMessage } from '@/lib/whatsapp'
import { parseBookingFields, findServiceByText, normalizePhoneForStorage } from '@/lib/whatsappUtils'
import { saveBooking } from '@/lib/bookings'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const fromRaw = (form.get('From') || '').toString()
    const body = (form.get('Body') || '').toString()

    const parsed = parseBookingFields(body)

    // Try to map to a canonical service from SERVICES
    const matched = parsed.service ? findServiceByText(parsed.service) : null
    const serviceName = matched ? matched.name : parsed.service || 'your selected service'

    // Save incoming booking request to local store
    const booking = await saveBooking({
      source: 'twilio',
      from: normalizePhoneForStorage(fromRaw),
      service: serviceName,
      name: parsed.name || undefined,
      dateTime: parsed.dateTime || undefined,
      barber: parsed.barber || undefined,
      raw: body,
      status: 'pending',
    })

    const ack = buildAckMessage({ name: parsed.name, serviceName, dateTime: parsed.dateTime, barberName: parsed.barber, ref: booking.id })

    // Send acknowledgement back via Twilio
    await sendTwilioMessage(fromRaw, ack)

    return new Response('OK')
  } catch (err) {
    return new Response('error', { status: 500 })
  }
}
