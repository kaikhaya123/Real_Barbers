import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloatingButton from '@/components/ui/WhatsAppFloatingButton'

const chromateSerif = localFont({
  src: [
    {
      path: '../public/Font/Chromate-Serif-Typeface/Chromate-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-chromate-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pro Barber Shop ZA | Professional Barber Services in Durban',
  description: 'Pro Barber Shop ZA — Professional grooming in Durban. Book online or join our walk-in queue for reliable, modern barber services.',
  keywords: 'barbershop, Durban, KZN, grooming, haircut, beard trim, barber services',
  openGraph: {
    title: 'Pro Barber Shop ZA | Professional Barber Services in Durban',
    description: 'Pro Barber Shop ZA — Professional grooming in Durban.',
    type: 'website',
  },
} 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={chromateSerif.variable}>
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
