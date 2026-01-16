'use client'

import { useEffect, useState } from 'react'
import Section from '@/components/ui/Section'

export default function BarberVideoSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Section className="relative w-full h-screen min-h-screen bg-black overflow-hidden py-0">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover transition-opacity duration-700"
          autoPlay
          muted
          loop
          playsInline
          style={{ opacity: visible ? 1 : 0, filter: 'brightness(0.55)' }}
        >
          <source src="/Video/7697138-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-end justify-start px-4 sm:px-8 lg:px-12 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-left">
            Premium cuts. No waiting.
          </h2>

          <p className="text-lg sm:text-xl text-gray-200 mb-8 text-left">
            Book fast through WhatsApp. Walk in confident. Leave sharp.
          </p>

          <div className="mb-4">
            <a
              href="/book"
              className="inline-block px-10 py-4 bg-white text-black font-semibold rounded-lg transition-transform duration-300 hover:scale-105"
            >
              Book via WhatsApp
            </a>
          </div>

          <p className="text-sm text-gray-300 text-left">
            Trusted by 1,800+ local clients
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </Section>
  )
}
