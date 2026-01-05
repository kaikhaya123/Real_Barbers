# Real Barbershop ™️ - Official Website

A premium, production-ready barbershop website built for Real Barbershop in Durban, KwaZulu Natal, South Africa.

## 🎯 Purpose

This website solves real operational problems for a high-demand barbershop:
- **Appointment requests via WhatsApp**: Clients request appointments via WhatsApp (temporary flow)
- **Digital Walk-In Queue**: Walk-ins can join a virtual queue and track their position
- **Reduced Wait Times**: Better time management for both staff and clients
- **Hybrid Model**: Supports both online bookings and traditional walk-ins

## 🚀 Features

### For Clients
- **Request Appointments via WhatsApp**: Choose service, barber, date, and time and send a pre-filled WhatsApp message to request the booking
- **Join Walk-In Queue**: Get a queue position without physically waiting
- **Live Queue Updates**: Track position and estimated wait time in real-time
- **Mobile-First Design**: Optimized for use on smartphones
- **SMS Notifications**: Receive booking confirmations and queue updates

### Business Features
- Service catalog with pricing
- Barber profiles with specialties
- Operating hours management
- Location with Google Maps integration
- Contact information and FAQs

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   ├── book/                 # Booking page
│   ├── queue/                # Walk-in queue page
│   ├── barbers/              # Barbers profile page
│   ├── contact/              # Contact page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── booking/              # Booking flow components
│   ├── queue/                # Queue management components
│   ├── home/                 # Homepage sections
│   ├── layout/               # Header & Footer
│   └── ui/                   # Reusable UI components
├── lib/                      # Utilities and constants
│   ├── constants.ts          # Business data and config
│   └── types.ts              # TypeScript interfaces
└── public/                   # Static assets
```

## 🎨 Design Principles

- **Clean & Minimal**: No clutter, focused user experience
- **Premium Feel**: Professional aesthetic matching the business
- **Mobile-First**: Optimized for smartphones (primary user device)
- **Fast & Accessible**: Performance and accessibility prioritized
- **Trust-Building**: Social proof, clear information, professional presentation

## 🔧 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Key Pages

### 1. Homepage (`/`)
- Hero section with strong CTAs
- Explanation of booking options
- Services overview
- Social proof & testimonials
- Location and hours

### 2. Book Appointment (`/book`)
- 4-step booking flow:
  1. Select service
  2. Choose barber
  3. Pick date & time
  4. Enter details & confirm
- Smart time slot management
- Booking confirmation screen

### 3. Walk-In Queue (`/queue`)
- Join queue form
- Live position tracking
- Estimated wait time
- SMS notification system
- Queue status updates

### 4. Our Barbers (`/barbers`)
- Detailed barber profiles
- Experience and specialties
- Direct booking links
- Availability status

### 5. Contact (`/contact`)
- Multiple contact methods
- Google Maps integration
- Opening hours
- FAQ section

## 🔄 Booking Logic

### Time Slot Management
- Slots generated based on service duration
- Buffer time between appointments (configurable)
- Operating hours respected by day of week
- Past times filtered out for today
- Prevents double booking

### Queue System
- Position tracking
- Dynamic wait time calculation
- Status updates (waiting, called, served)
- Barber preference optional
- Leave queue functionality

## 📊 Business Information

All business data is centralized in `/lib/constants.ts`:
- Services and pricing
- Barber profiles
- Operating hours
- Contact information
- Time slots configuration

**To customize**, update the constants file with your business details.

## 🎯 Next Steps for Production

### Backend Integration
The frontend is ready. To make it fully functional, integrate:

1. **Database** (Firebase/Supabase):
   - Store bookings
   - Manage queue entries
   - Track barber availability

2. **Authentication** (optional):
   - Client accounts
   - Booking history
   - Admin dashboard

3. **Notifications**:
   - SMS API (Twilio, Africa's Talking)
   - WhatsApp Business API
   - Email confirmations

4. **Payment Integration** (optional):
   - Online deposits
   - Payment gateway
   - Cancellation policies

5. **Admin Panel**:
   - View bookings
   - Manage queue
   - Update availability
   - Business analytics

### Deployment Options
- **Vercel**: Recommended for Next.js (easiest)
- **Netlify**: Alternative with good performance
- **VPS**: Full control (Hetzner, DigitalOcean)

## 🚦 Environment Variables

Create a `.env.local` file:

```env
# Add when implementing backend
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
# SMS/WhatsApp API keys
# Database connection strings
```

## 📝 Customization Guide

### Colors
Edit `/tailwind.config.js`:
- `primary`: Main brand color (browns/neutrals)
- `accent`: Call-to-action color (orange)

### Content
Edit `/lib/constants.ts`:
- Business information
- Services and pricing
- Barber profiles
- Operating hours

### Styling
- Global styles: `/app/globals.css`
- Component styles: Tailwind classes in components

## 🤝 Contributing

This is a custom business website. For modifications:
1. Test thoroughly before deploying
2. Maintain mobile-first approach
3. Keep the clean, professional aesthetic
4. Don't break the hybrid booking flow

## 📄 License

© 2026 Real Barbershop ™️. All rights reserved.

---

**Built with ❤️ for Real Barbershop, Durban, KZN**
