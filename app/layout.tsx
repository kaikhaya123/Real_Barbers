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
  variable: '--font-rethink-sansk-sans/RethinkSans-Italic[wght].ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-rethink-sans',
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
  children,rethinkSans
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
