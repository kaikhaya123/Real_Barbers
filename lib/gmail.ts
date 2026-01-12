import nodemailer from 'nodemailer'

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
})

export interface BookingEmailData {
  name: string
  email: string
  service: string
  datetime: string
  barber: string
  queueNumber: string
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn('[Email] Gmail credentials not configured')
    return false
  }

  try {
    const { name, email, service, datetime, barber, queueNumber } = data
    const prettyDate = datetime?.split(' ')[0] || 'TBD'
    const prettyTime = datetime?.split(' ')[1] || 'TBD'

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 0; }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px; }
            .queue-box { background: #fbbf24; color: #1a1a2e; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .queue-label { font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; font-weight: bold; }
            .queue-number { font-size: 48px; margin: 0; font-weight: bold; font-family: 'Courier New', monospace; }
            .booking-box { background: white; padding: 20px; border-left: 4px solid #fbbf24; margin: 20px 0; border-radius: 4px; }
            .booking-item { margin: 8px 0; }
            .booking-label { font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Booking Confirmed</h1>
              <p>Your appointment is all set!</p>
            </div>
            
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
              
              <div class="queue-box">
                <p class="queue-label">Your Queue Number</p>
                <p class="queue-number">${queueNumber}</p>
                <p style="font-size: 12px; margin: 8px 0 0 0; opacity: 0.8;">Keep this for reference</p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Your booking has been saved and confirmed. Here are your appointment details:</p>
              
              <div class="booking-box">
                <div class="booking-item"><span class="booking-label">Service:</span> ${service}</div>
                <div class="booking-item"><span class="booking-label">Date:</span> ${prettyDate}</div>
                <div class="booking-item"><span class="booking-label">Time:</span> ${prettyTime}</div>
                <div class="booking-item"><span class="booking-label">Barber:</span> ${barber}</div>
              </div>
              
              <p style="font-size: 14px; color: #666; margin: 20px 0;">Our team will reach out shortly to confirm these details. If you need to make any changes, please contact us.</p>
              
              <p style="font-size: 12px; color: #999; margin-top: 30px;">Thanks for choosing Pro Barber Shop! 💈</p>
            </div>
            
            <div class="footer">
              <p>This is an automated confirmation email. Please do not reply directly.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const mailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: `✓ Booking Confirmed - Your Queue #${queueNumber}`,
      html: htmlContent,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('[Email] Gmail confirmation sent to:', email, 'Queue #' + queueNumber, 'Message ID:', result.messageId)
    return true
  } catch (err) {
    console.error('[Email] Gmail SMTP error:', err)
    return false
  }
}
