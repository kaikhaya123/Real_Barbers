import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Users, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { BUSINESS_INFO } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden -mt-16 md:-mt-20">
      {/* Dual Image Split */}
      <div className="relative w-full h-full flex flex-col md:flex-row">
        
        {/* Left Image */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
          <Image
            src="/Images/Daniel Mitchel (Charlie's Older Half-Brother).jpg"
            alt="Real Barbershop"
            fill
            className="object-cover object-center brightness-90 contrast-110"
            priority
            quality={100}
          />
        </div>
        
        {/* Right Image */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
          <Image
            src="/Images/From KlickPin CF Pin by Queenk on Black Lady Hairstyles _ Short thin hair Black natural hairstyles Super short hair.jpg"
            alt="Short Haircut for Women"
            fill
            className="object-cover object-center md:object-left brightness-90 contrast-110"
            priority
            quality={100}
          />
        </div>
        
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        
        {/* Bottom Centered Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end items-center text-center text-white px-6 md:px-12 pb-16 md:pb-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight max-w-4xl">
            Built for your best look.
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-8 lg:mb-10 max-w-2xl opacity-90 leading-relaxed">
            Clean fades. Sharp lines. Every time.
          </p>
          
          {/* CTA */}
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-dark-900 font-semibold text-base hover:bg-white/90 transition-all duration-200 shadow-lg"
          >
            Book Appointment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
