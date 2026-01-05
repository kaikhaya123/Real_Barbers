import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloatingButton from '@/components/ui/WhatsAppFloatingButton'

const rethinkSans = localFont({
  src: [
    {
      path: '../public/Font/rethink-sans/RethinkSans[wght].ttf',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../public/Font/rethink-sans/RethinkSans-Italic[wght].ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-rethink-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Real Barbershop ™️ | Premium Barber Services in Durban',
  description: 'Experience professional haircuts at Real Barbershop in Durban, KZN. Book your appointment online or join our walk-in queue for premium barber services.',
  keywords: 'barbershop, Durban, KZN, grooming, haircut, beard trim, barber services',
  openGraph: {
    title: 'Real Barbershop ™️ | Premium Barber Services in Durban',
    description: 'Experience professional haircuts at Real Barbershop in Durban, KZN.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={rethinkSans.variable}>
      <body className="font-sans antialiased">
        <Header />
        <main className="pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  )
}
