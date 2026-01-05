# Real Barbershop Website - Setup & Development Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: http://localhost:3000

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization Checklist

### Business Information
- [ ] Update contact details in `/lib/constants.ts`
- [ ] Replace phone numbers (currently placeholder)
- [ ] Update WhatsApp number
- [ ] Verify address and coordinates
- [ ] Update business hours if different

### Services
- [ ] Review services in `/lib/constants.ts`
- [ ] Adjust pricing (currently in ZAR)
- [ ] Update service durations
- [ ] Add or remove services as needed

### Barbers
- [ ] Update barber profiles in `/lib/constants.ts`
- [ ] Replace placeholder images
- [ ] Update barber names and specialties
- [ ] Add or remove barbers

### Styling
- [ ] Review color scheme in `/tailwind.config.js`
- [ ] Adjust if brand colors different
- [ ] Test on mobile devices
- [ ] Check accessibility

## 🔧 Backend Integration Roadmap

### Phase 1: Database Setup
**Recommended: Firebase or Supabase**

Database Schema:
```
bookings/
  - id
  - clientName
  - clientPhone
  - clientEmail
  - serviceId
  - barberId
  - date
  - time
  - status
  - createdAt

queue/
  - id
  - clientName
  - clientPhone
  - position
  - estimatedWait
  - joinedAt
  - status
  - preferredBarberId

barbers/
  - id
  - name
  - available
  - currentClient
```

### Phase 2: API Routes
Create in `/app/api/` (note: API routes are planned/available):
- `/api/bookings/create` - Create new booking (POST)
- `/api/bookings/check` - Check availability (GET `?barber=...&date=YYYY-MM-DD&time=HH:MM`)
- `/api/bookings/[id]` - Get/update/delete booking (planned)
- `/api/queue/join` - Join queue (planned)
- `/api/queue/status` - Get queue position (planned)
- `/api/queue/[id]` - Leave queue (planned)
- `/api/availability` - Check time slot availability (planned)

### Phase 3: Real-time Updates
- Implement WebSocket or Firebase Realtime Database
- Live queue position updates
- Booking confirmations
- Availability sync

### Phase 4: Notifications
**SMS Provider Options for South Africa:**
- Africa's Talking
- Twilio
- BulkSMS

Implement:
- Booking confirmation SMS
- Queue position updates
- Reminder SMS (24h before)
- WhatsApp messages (optional)

### Phase 5: Admin Dashboard
Create admin routes:
- `/admin/dashboard` - Overview
- `/admin/bookings` - Manage bookings
- `/admin/queue` - Queue management
- `/admin/barbers` - Update availability

## 📱 Testing Checklist

### Functionality
- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Booking flow completes all 4 steps
- [ ] Queue join form validates correctly
- [ ] All CTAs link to correct pages
- [ ] Mobile menu opens/closes

### Responsive Design
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Check landscape orientation

### Performance
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Optimize images (when added)
- [ ] Test on slow 3G network

## 🌐 Deployment Guide

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically
4. Free SSL certificate included

### Option 2: Netlify
1. Push code to GitHub
2. Connect to Netlify
3. Configure build settings
4. Deploy

### Option 3: VPS
1. Set up Ubuntu server
2. Install Node.js and PM2
3. Clone repository
4. Build and run with PM2
5. Configure Nginx reverse proxy

## 🔐 Environment Variables

When you add backend:

```env
# Database
DATABASE_URL=

# Local SQLite (dev):
DB_PATH=./data/bookings.db

# SMS/WhatsApp
AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=

# Google Maps (for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Admin
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=

# App URLs
NEXT_PUBLIC_APP_URL=https://realbarbershop.co.za
```

<!-- WhatsApp webhook integration removed. The floating WhatsApp button UI is retained. -->


## 📊 Analytics Setup

### Google Analytics
1. Create GA4 property
2. Add tracking code to `/app/layout.tsx`
3. Track key events:
   - Booking completed
   - Queue joined
   - Page views
   - WhatsApp CTA clicks (`whatsapp_cta_click`)
   - WhatsApp booking requests from the in-site flow (`whatsapp_booking_request`)

### Facebook Pixel (optional)
- Track conversions
- Retargeting campaigns

## 💡 Feature Enhancements

### Future Additions
- [ ] Client accounts & booking history
- [ ] Online payments/deposits
- [ ] Loyalty program
- [ ] Gift vouchers
- [ ] Photo gallery
- [ ] Blog for grooming tips
- [ ] Instagram feed integration
- [ ] Multi-language support (English/Zulu)

## 🛠 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
```bash
# Check TypeScript errors
npm run lint
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📞 Support

For questions about this codebase:
1. Check the README.md
2. Review component documentation
3. Check Next.js documentation

For business inquiries:
- Email: info@realbarbershop.co.za
- Phone: [Update with real number]

---

**Good luck with your barbershop website! 💈**
