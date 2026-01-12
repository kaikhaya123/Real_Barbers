import { NextRequest, NextResponse } from 'next/server'
import { saveBooking } from '@/lib/bookings'
import { sendTwilioMessage } from '@/lib/whatsappClient'
import { sanitizePhone } from '@/lib/whatsapp'
import { generateQueueNumber, formatQueueDisplay } from '@/lib/queue'
import { sendBookingConfirmationEmail } from '@/lib/gmail'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, service, datetime, barber, phone, email } = body

    // Validate required fields
    if (!service) {
      return NextResponse.json({ error: 'Service is required' }, { status: 400 })
    }

    // Generate queue number based on date and barber
    const bookingDate = datetime?.split(' ')[0] || new Date().toISOString().split('T')[0]
    const queueNumber = await generateQueueNumber(bookingDate, barber || 'General')
    const queueDisplay = formatQueueDisplay(queueNumber, barber)

    // Save booking to Supabase
    const booking = await saveBooking({
      source: 'web',
      from: phone ? sanitizePhone(phone) : '+0000000000',
      service,
      name: name || undefined,
      datetime: datetime || undefined,
      barber: barber || undefined,
      raw: JSON.stringify({ name, service, datetime, barber, phone, email, queueNumber: queueDisplay }),
      status: 'pending',
    })

    console.log('[Web Booking] Created:', { bookingId: booking.id, service, name, phone, queueNumber: queueDisplay })
    
    let confirmationSent = false
    let confirmationMethod = 'none'

    // PRIMARY: Try EMAIL first if provided
    if (email) {
      try {
        const emailSent = await sendBookingConfirmationEmail({
          name: name || 'Customer',
          email,
          service,
          datetime: datetime || 'To be scheduled',
          barber: barber || 'Any available',
          queueNumber: queueDisplay,
        })
        if (emailSent) {
          console.log('[Web Booking] Email confirmation sent to:', email, 'Queue:', queueDisplay)
          confirmationSent = true
          confirmationMethod = 'email'
        }
      } catch (err) {
        console.error('[Web Booking] Email failed:', err)
        // Continue to WhatsApp fallback
      }
    }

    // FALLBACK: Try WhatsApp if email failed or not provided
    if (!confirmationSent && phone) {
      try {
        const cleanPhone = sanitizePhone(phone)
        const confirmationMsg = `
✓ *Booking Confirmed*

Hi ${name || 'there'}! 👋

Queue #: ${queueDisplay}

Your booking has been saved!

📋 *Details:*
• Service: ${service}
• Date & Time: ${datetime || 'To be scheduled'}
• Barber: ${barber || 'Any available'}

📌 *Reference: ${booking.id}*

We'll contact you shortly to confirm. Thanks! 💈
        `.trim()

        await sendTwilioMessage(`whatsapp:+${cleanPhone}`, confirmationMsg)
        console.log('[Web Booking] WhatsApp confirmation sent to:', cleanPhone)
        confirmationSent = true
        confirmationMethod = 'whatsapp'
      } catch (err: any) {
        console.error('[Web Booking] WhatsApp failed:', err?.message)
      }
    }

    if (!confirmationSent) {
      console.warn('[Web Booking] No confirmation method available (no email/phone or all failed)')
    }
    
    return NextResponse.json({ 
      success: true,
      booking: {
        id: booking.id,
        service,
        datetime,
        barber,
        name,
        status: 'pending',
        phone: phone ? sanitizePhone(phone) : undefined,
        queueNumber: queueDisplay,
      },
      confirmation: {
        sent: confirmationSent,
        method: confirmationMethod,
      }
    }, { status: 201 })
  } catch (err: any) {
    console.error('[Web Booking] Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create booking' }, { status: 500 })
  }
}
