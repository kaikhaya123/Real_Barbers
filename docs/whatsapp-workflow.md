# WhatsApp Booking Workflow for Real Barbershop

This document describes the recommended workflow for running a professional WhatsApp-based booking system.

## 1. Booking Flow (Client Experience)

1. Client lands on the website.
2. Prominent **Book via WhatsApp** CTA is visible on relevant pages (header, services, /book, floating CTA after hero).
3. Client clicks the CTA and WhatsApp opens with a professional pre-filled booking message.

Pre-filled message (site-wide floating CTA):

```
Hi, welcome to Real Barbershop 👋. Which haircut or service would you like to book today?
Name:
Preferred Date & Time:
Any special requests:
```

If the client goes through the in-site booking flow, the message is pre-filled with selections (service, barber, date/time) and client details they entered.

4. Client fills and sends the message in WhatsApp.
5. WhatsApp Business auto-reply confirms that the request has been received.
6. Admin/stylist reviews the request, confirms availability, and replies with a booking confirmation message.
7. Optionally send a reminder 24 hours before the appointment using scheduled messages or a third-party provider.

## 2. Auto-Reply & Templates (Suggested)

- Auto-reply on message received (Quick Reply / Greeting):

```
Thank you for your booking request! 💈
We have received your details and will confirm your appointment shortly.
Looking forward to welcoming you at Real Barbershop.
```

- Confirmation message (sent by admin):

```
Your appointment for [SERVICE] on [DATE] at [TIME] is confirmed ✅
Thank you for choosing Real Barbershop. We look forward to seeing you!
```

- Reminder message (sent 24 hours before):

```
Hi [NAME], just a reminder of your appointment at Real Barbershop tomorrow at [TIME] 💈
See you soon!
```

## 3. WhatsApp Labels & Organization

Use WhatsApp Business labels to track status and workflow:
- Pending (new requests)
- Confirmed
- Completed
- No-show
- Follow-up

Suggested process:
- When a request arrives, add label `Pending`.
- After confirming availability, move to `Confirmed` and reply with the confirmation template.
- When the appointment is completed, move to `Completed`.
- If the client cancels or doesn't show, mark `No-show` and optionally add a quick follow-up.

## 4. Minimal CRM / Export

You can periodically export labeled messages or manually copy booking details into Google Sheets. For higher scale, consider integrating using the WhatsApp Business API or with a trusted provider (Twilio / 360dialog) later.

## 5. Analytics & Tracking

We track two events from the website:
- `whatsapp_cta_click` — Fired when the floating CTA is clicked. Payload includes `location` and `path`.
- `whatsapp_booking_request` — Fired when a user submits the in-site booking flow which opens WhatsApp. Payload includes `source`, `serviceId`, and `barberId`.

Events are sent to `gtag` if available, or pushed to `dataLayer`. If neither is available, events are posted to `/api/track`.

## 6. Implementation Notes (for Admins)

- Set up WhatsApp Business profile: business name, opening hours, address, short description, and profile image.
- Configure **Quick Replies** and **Greeting Message** in the app for fast replies.
- Use labels to triage and assign messages to staff.
- Reserve time each hour for staff to check the `Pending` queue and confirm requests.

## 7. Next Steps (Optional)

- Add a small admin panel to sync WhatsApp confirmations into the Supabase bookings table (for a hybrid approach).
- Integrate automated reminders using a provider if volume grows.

---

This document is intended to help operations run a professional, high-conversion WhatsApp booking experience while keeping the process personal and human-led.