import { sendTwilioMessage } from '@/lib/whatsappClient'
import { 
  buildAckMessage, 
  buildConfirmationMessage, 
  buildUnavailableMessage,
  buildChangeRequestMessage,
  buildCancellationMessage,
  detectReplyType
} from '@/lib/whatsapp'
import { parseBookingFields, findServiceByText, normalizePhoneForStorage } from '@/lib/whatsappUtils'
import { saveBooking, findPendingBookingByPhone, updateBookingStatus, isBarberAvailable } from '@/lib/bookings'
import { SERVICES } from '@/lib/constants'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const fromRaw = (form.get('From') || '').toString()
    const body = (form.get('Body') || '').toString()
    
    // Log incoming message for debugging
    console.log('[Twilio Webhook] Incoming message:', { fromRaw, body: body.substring(0, 50) })
    
    const from = normalizePhoneForStorage(fromRaw)
    
    // Skip messages from the Twilio sandbox number itself (loopback)
    const twilioFrom = process.env.TWILIO_FROM || ''
    if (fromRaw.includes(twilioFrom.replace('whatsapp:', '')) || fromRaw === twilioFrom) {
      console.log('[Twilio Webhook] Skipping loopback message from sandbox number')
      return new Response('OK')
    }

    // Check if this is a reply to an existing booking (1, 2, or 3)
    const replyType = detectReplyType(body)
    
    if (replyType) {
      // Handle customer reply to existing booking
      const pendingBooking = await findPendingBookingByPhone(from)
      
      if (!pendingBooking) {
        await sendTwilioMessage(fromRaw, "We couldn't find a pending booking for you. Please send a new booking request.")
        return new Response('OK')
      }

      if (replyType === '1') {
        // Confirm booking
        const service = SERVICES.find(s => s.name === pendingBooking.service)
        const duration = service?.duration || 60
        
        // Check if barber is available
        const available = await isBarberAvailable(pendingBooking.barber, pendingBooking.dateTime, duration)
        
        if (!available) {
          // Barber not available
          const unavailMsg = buildUnavailableMessage({
            name: pendingBooking.name,
            serviceName: pendingBooking.service,
            barberName: pendingBooking.barber,
            ref: pendingBooking.id,
          })
          await updateBookingStatus(pendingBooking.id, 'pending')
          await sendTwilioMessage(fromRaw, unavailMsg)
        } else {
          // Confirm the booking
          await updateBookingStatus(pendingBooking.id, 'confirmed')
          const confirmMsg = buildConfirmationMessage({
            name: pendingBooking.name,
            serviceName: pendingBooking.service,
            dateTime: pendingBooking.dateTime,
            barberName: pendingBooking.barber,
            ref: pendingBooking.id,
          })
          await sendTwilioMessage(fromRaw, confirmMsg)
        }
      } else if (replyType === '2') {
        // Customer wants to change booking
        const changeMsg = buildChangeRequestMessage({
          name: pendingBooking.name,
          ref: pendingBooking.id,
        })
        await sendTwilioMessage(fromRaw, changeMsg)
      } else if (replyType === '3') {
        // Cancel booking
        await updateBookingStatus(pendingBooking.id, 'cancelled')
        const cancelMsg = buildCancellationMessage({
          name: pendingBooking.name,
          serviceName: pendingBooking.service,
          ref: pendingBooking.id,
        })
        await sendTwilioMessage(fromRaw, cancelMsg)
      }
    } else {
      // New booking request
      const parsed = parseBookingFields(body)

      // Try to map to a canonical service from SERVICES
      const matched = parsed.service ? findServiceByText(parsed.service) : null
      const serviceName = matched ? matched.name : parsed.service || 'your selected service'

      // Save incoming booking request to local store
      const booking = await saveBooking({
        source: 'twilio',
        from,
        service: serviceName,
        name: parsed.name || undefined,
        dateTime: parsed.dateTime || undefined,
        barber: parsed.barber || undefined,
        raw: body,
        status: 'pending',
      })

      const ack = buildAckMessage({ 
        name: parsed.name, 
        serviceName, 
        dateTime: parsed.dateTime, 
        barberName: parsed.barber, 
        ref: booking.id 
      })

      // Send acknowledgement back via Twilio
      console.log('[Twilio Webhook] Sending ack to:', fromRaw)
      await sendTwilioMessage(fromRaw, ack)
    }

    return new Response('OK')
  } catch (err) {
    console.error('Twilio webhook error:', err)
    // Always return a response, even on error
    return new Response('OK', { status: 200 })
  }
}

