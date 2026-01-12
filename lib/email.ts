import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export async function sendBookingConfirmation(email: string, booking: {
  name: string
  service: string
  datetime: string
  barber: string
  queueNumber: string
}): Promise<boolean> {
  if (!resend) {
    console.warn('[Email] No Resend API key configured')
    return false
  }

  try {
    const prettyDate = booking.datetime?.split(' ')[0] || 'TBD'
    const prettyTime = booking.datetime?.split(' ')[1] || 'TBD'

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✓ Booking Confirmed</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your appointment is all set!</p>
        </div>
        
        <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${booking.name},</p>
          
          <div style="background: #fbbf24; color: #1a1a2e; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; font-weight: bold;">Your Queue Number</p>
            <p style="font-size: 48px; margin: 0; font-weight: bold; font-family: 'Courier New', monospace;">${booking.queueNumber}</p>
            <p style="font-size: 12px; margin: 8px 0 0 0; opacity: 0.8;">Keep this for reference</p>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Your booking has been saved and confirmed. Here are your appointment details:</p>
          
          <div style="background: white; padding: 20px; border-left: 4px solid #fbbf24; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Service:</strong> ${booking.service}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${prettyDate}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${prettyTime}</p>
            <p style="margin: 8px 0;"><strong>Barber:</strong> ${booking.barber}</p>
          </div>
          
          <p style="font-size: 14px; color: #666; margin: 20px 0;">Our team will reach out shortly to confirm these details. If you need to make any changes, please contact us via WhatsApp.</p>
          
          <p style="font-size: 12px; color: #999; margin-top: 30px;">Thanks for choosing Pro Barber Shop! 💈</p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: 'bookings@resend.dev',
      to: email,
      subject: `✓ Booking Confirmed - Your Queue #${booking.queueNumber}`,
      html: htmlContent,
    })

    if (result.error) {
      console.error('[Email] Resend returned error:', result.error)
      return false
    }

    console.log('[Email] Confirmation sent to:', email, 'Queue #' + booking.queueNumber, 'ID:', result.data?.id)
    return true
  } catch (err) {
    console.error('[Email] Failed to send confirmation:', err)
    return false
  }
}
