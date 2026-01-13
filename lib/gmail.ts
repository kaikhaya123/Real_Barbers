import nodemailer from 'nodemailer'

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

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
  location?: string
}

export async function sendBookingConfirmationEmail(
  data: BookingEmailData
): Promise<boolean> {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return false

  try {
    const { name, email, service, datetime, barber, queueNumber } = data
    const [prettyDate = 'TBD', prettyTime = 'TBD'] = datetime?.split(' ') || []

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
<style>
body {
  margin: 0;
  background: #f4f4f5;
  font-family: Poppins, Arial, sans-serif;
  color: #111;
}
.container {
  max-width: 600px;
  margin: 24px auto;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
.header {
  background: #ffffff;
  color: #111;
  text-align: center;
  padding: 36px 24px;
}
.header img {
  width: 90px;
  margin-bottom: 12px;
}
.header h1 {
  font-size: 22px;
  margin: 0;
}
.header p {
  font-size: 13px;
  color: #666;
  margin-top: 6px;
}
.content {
  padding: 32px 26px;
}
.greeting {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}
.text {
  font-size: 14px;
  color: #444;
  line-height: 1.6;
  margin-bottom: 22px;
}
.queue {
  text-align: center;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 28px;
}
.queue span {
  font-size: 11px;
  letter-spacing: 1px;
  font-weight: 700;
  color: #555;
}
.queue h2 {
  font-size: 52px;
  margin: 10px 0 4px;
  letter-spacing: 3px;
}
.queue p {
  font-size: 12px;
  color: #555;
}
.details {
  border-top: 1px solid #eee;
  padding-top: 20px;
  margin-bottom: 28px;
}
.detail {
  margin-bottom: 14px;
}
.label {
  font-size: 11px;
  text-transform: uppercase;
  color: #777;
}
.value {
  font-size: 15px;
  font-weight: 600;
}
.next {
  background: #f9fafb;
  border-radius: 12px;
  padding: 22px;
}
.next h3 {
  margin: 0 0 14px;
  font-size: 16px;
}
.next li {
  font-size: 13px;
  color: #444;
  margin-bottom: 10px;
}
.footer {
  background: #111;
  color: #ffffff;
  text-align: center;
  padding: 22px;
  font-size: 11px;
}
.footer a {
  color: #ffffff;
  text-decoration: none;
  margin: 0 6px;
  font-weight: 600;
}
</style>
</head>

<body>
<div class="container">

  <div class="header">
    <img src="https://pro-barbershop.vercel.app/logo/Pro_barbershop_logo.png" alt="Pro Barber Shop">
    <h1>BOOKING CONFIRMED</h1>
    <p>Your spot is secured</p>
  </div>

  <div class="content">
    <div class="greeting">Hi ${name},</div>
    <div class="text">
      Your haircut is booked. Keep your queue number ready when you arrive.
    </div>

    <div class="queue">
      <span>QUEUE NUMBER</span>
      <h2>${queueNumber}</h2>
      <p>Show this on arrival</p>
    </div>

    <div class="details">
      <div class="detail">
        <div class="label">Service</div>
        <div class="value">${service}</div>
      </div>
      <div class="detail">
        <div class="label">Date</div>
        <div class="value">${prettyDate}</div>
      </div>
      <div class="detail">
        <div class="label">Time</div>
        <div class="value">${prettyTime}</div>
      </div>
      <div class="detail">
        <div class="label">Barber</div>
        <div class="value">${barber}</div>
      </div>
    </div>

    <div class="next">
      <h3>What to do next</h3>
      <ul>
        <li>Arrive 5 to 10 minutes early</li>
        <li>Keep your queue number saved</li>
        <li>Message us on WhatsApp if needed</li>
      </ul>
    </div>
  </div>

  <div class="footer">
    <a href="https://pro-barbershop.vercel.app">Website</a> |
    <a href="https://wa.me/27682770367">WhatsApp</a> |
    <a href="tel:+27682188679">Call</a>
    <div style="margin-top:10px">
      © 2026 Pro Barber Shop 
    </div>
  </div>

</div>
</body>
</html>
`

    await transporter.sendMail({
      from: GMAIL_USER,
      to: email,
      subject: `Booking Confirmed | Queue #${queueNumber}`,
      html,
    })

    return true
  } catch {
    return false
  }
}
