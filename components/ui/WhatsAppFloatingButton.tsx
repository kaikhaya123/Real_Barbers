'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BUSINESS_INFO, BARBERS } from '@/lib/constants'
import { buildWhatsAppLink, buildBookingMessage } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'

export default function WhatsAppFloatingButton() {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // Show the text for a short time when the button first appears, then collapse to icon-only
  const [showText, setShowText] = useState(true)
  const hideTimerRef = useRef<number | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
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

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('click', onDocClick)
      return () => document.removeEventListener('click', onDocClick)
    }
  }, [menuOpen])

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

  const openWhatsAppWithBarber = (barberId: string, barberName: string) => {
    const message = buildBookingMessage({ barberName })
    const link = buildWhatsAppLink(BUSINESS_INFO.whatsapp, message)

    try {
      trackEvent('whatsapp_cta_click', { location: 'floating_button', path: pathname, barber: barberId })
    } catch (e) {}

    try {
      window.open(link, '_blank')
    } catch (e) {
      window.location.href = link
    }

    setMenuOpen(false)
  }

  return (
    <div
      aria-hidden={!visible}
      className={`fixed right-6 bottom-6 z-50 transition-all duration-300 ease-out select-none ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <div className="relative" ref={menuRef}>
        {/* Menu (appears above the button) */}
        {menuOpen && (
          <div className="absolute bottom-16 right-0 w-64 bg-white border rounded-lg shadow-lg overflow-hidden text-left">
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-semibold">Book with a barber</p>
            </div>
            <ul className="max-h-56 overflow-auto">
              <li>
                <button
                  onClick={() => openWhatsAppGeneric()}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                >
                  Any available barber
                </button>
              </li>
              {BARBERS.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => openWhatsAppWithBarber(b.id, b.name)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="flex-1">{b.name}</span>
                    <span className="text-xs text-gray-400">{b.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

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

          {/* Toggle menu button */}
          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-expanded={menuOpen}
            aria-label="Choose a barber to book with"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

