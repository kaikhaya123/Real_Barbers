import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface BookingEmailData {
  customerName: string
  customerEmail: string
  service: string
  datetime: string
  barber: string
  bookingId: string
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  if (!resend || !process.env.RESEND_API_KEY) {
    console.warn('[Email] Resend not configured, skipping email')
    return false
  }

  try {
    const { customerName, customerEmail, service, datetime, barber, bookingId } = data

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-box { background: white; padding: 20px; border-left: 4px solid #d4a574; margin: 20px 0; border-radius: 4px; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; }
            .detail-value { font-weight: 600; }
            .reference-box { background: #fef3f2; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0; }
            .reference-label { color: #666; font-size: 12px; }
            .reference-code { font-size: 24px; font-weight: bold; color: #d4a574; font-family: monospace; letter-spacing: 1px; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
            .button { display: inline-block; background: #d4a574; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✓ Booking Confirmed</h1>
              <p style="margin: 5px 0 0 0;">Your appointment is on our calendar</p>
            </div>
            
            <div class="content">
              <p>Hi ${customerName},</p>
              
              <p>Your barbershop appointment has been successfully booked! Here are your booking details:</p>
              
              <div class="booking-box">
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">${service}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date & Time:</span>
                  <span class="detail-value">${datetime}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Barber:</span>
                  <span class="detail-value">${barber}</span>
                </div>
              </div>
              
              <div class="reference-box">
                <div class="reference-label">Booking Reference</div>
                <div class="reference-code">${bookingId}</div>
                <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">Keep this for your records</p>
              </div>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>✓ Your booking has been saved to our system</li>
                <li>• Our staff will review your booking</li>
                <li>• You'll receive a WhatsApp confirmation soon</li>
                <li>• We'll send you a reminder 24 hours before</li>
                <li>• Please arrive 5-10 minutes early</li>
              </ul>
              
              <p>If you need to reschedule or have any questions, reply to this email or contact us via WhatsApp.</p>
              
              <p>Thanks for choosing us! 💈</p>
            </div>
            
            <div class="footer">
              <p>This is an automated confirmation email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'bookings@realbarbershop.co.za',
      to: customerEmail,
      subject: `Booking Confirmed - Reference ${bookingId}`,
      html: emailHtml,
    })

    if (result.error) {
      console.error('[Email] Resend error:', result.error)
      return false
    }

    console.log('[Email] Confirmation sent to:', customerEmail, 'ID:', result.data?.id)
    return true
  } catch (err) {
    console.error('[Email] Failed to send confirmation:', err)
    return false
  }
}
