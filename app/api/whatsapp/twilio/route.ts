import { 
  parseBookingFields, 
  findServiceByText, 
  normalizePhoneForStorage 
} from '@/lib/whatsappUtils'
import { saveBooking, findPendingBookingByPhone, updateBookingStatus } from '@/lib/bookings'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const fromRaw = (form.get('From') || '').toString()
    const body = (form.get('Body') || '').toString()
    const messageStatus = (form.get('MessageStatus') || '').toString()
    
    // Handle status callback (delivery receipts)
    if (messageStatus) {
      const messageSid = (form.get('MessageSid') || '').toString()
      console.log('[Twilio Status Callback]', { messageSid, status: messageStatus })
      return new Response('OK')
    }
    
    // Handle incoming message
    if (!body) {
      console.log('[Twilio Webhook] Empty message body, skipping')
      return new Response('OK')
    }
    
    console.log('[Twilio Webhook] Incoming message:', { fromRaw, body: body.substring(0, 50) })
    
    const from = normalizePhoneForStorage(fromRaw)
    
    // Skip messages from the Twilio sandbox number itself (loopback)
    const twilioFrom = process.env.TWILIO_FROM || ''
    if (fromRaw.includes(twilioFrom.replace('whatsapp:', '')) || fromRaw === twilioFrom) {
      console.log('[Twilio Webhook] Skipping loopback message from sandbox number')
      return new Response('OK')
    }

    // Save booking to database (no auto-reply)
    const parsed = parseBookingFields(body)
    const matched = parsed.service ? findServiceByText(parsed.service) : null
    const serviceName = matched ? matched.name : parsed.service || 'appointment'

    const booking = await saveBooking({
      source: 'twilio',
      from,
      service: serviceName,
      name: parsed.name || undefined,
      datetime: parsed.dateTime || undefined,
      barber: parsed.barber || undefined,
      raw: body,
      status: 'pending',
    })

    console.log('[Twilio Webhook] Booking saved:', { bookingId: booking.id, from, service: serviceName })

    return new Response('OK')
  } catch (err) {
    console.error('Twilio webhook error:', err)
    // Always return a response, even on error
    return new Response('OK', { status: 200 })
  }
}

