'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BUSINESS_INFO } from '@/lib/constants'
import { buildWhatsAppLink, buildBookingMessage } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'

export default function WhatsAppFloatingButton() {
  const [visible, setVisible] = useState(false)
  // Show the text for a short time when the button first appears, then collapse to icon-only
  const [showText, setShowText] = useState(true)
  const hideTimerRef = useRef<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      // Show button once the user has scrolled past ~60% of the hero viewport
      const shouldShow = window.scrollY > window.innerHeight * 0.6
      setVisible(shouldShow)

      // When the button becomes visible, show text for a short time then collapse
      if (shouldShow) {
        setShowText(true)
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
        hideTimerRef.current = window.setTimeout(() => setShowText(false), 5000)
      } else {
        // If not visible, ensure the text is shown next time
        setShowText(true)
        if (hideTimerRef.current) {
          window.clearTimeout(hideTimerRef.current)
          hideTimerRef.current = null
        }
      }
    }

    // Initial check
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    }
  }, [])



  const openWhatsAppGeneric = () => {
    const message = buildBookingMessage({})
    const link = buildWhatsAppLink(BUSINESS_INFO.whatsapp, message)

    // Track the CTA click
    try {
      trackEvent('whatsapp_cta_click', { location: 'floating_button', path: pathname, barber: 'any' })
    } catch (e) {}

    try {
      window.open(link, '_blank')
    } catch (e) {
      window.location.href = link
    }
  }



  return (
    <div
      aria-hidden={!visible}
      className={`fixed right-6 bottom-6 z-50 transition-all duration-300 ease-out select-none ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <div className="relative">


        <div className="flex items-center gap-2">
          <button
            onClick={openWhatsAppGeneric}
            onMouseEnter={() => {
              // keep text visible while hovered
              setShowText(true)
              if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
            }}
            onMouseLeave={() => {
              // hide after brief delay when hover ends
              if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
              hideTimerRef.current = window.setTimeout(() => setShowText(false), 1500)
            }}
            aria-label="Chat with Real Barbershop on WhatsApp"
            className="flex items-center gap-3 bg-gradient-to-br from-green-600 to-green-500 text-white py-3 px-4 rounded-full shadow-2xl hover:scale-105 transform transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image src="/Icons/whatsapp.png" alt="WhatsApp" fill className="object-contain" />
            </div>
            {showText && <span className="hidden md:inline-block font-semibold">Chat on WhatsApp</span>}
            <span className="ml-1 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
          </button>


        </div>
      </div>
    </div>
  )
}

