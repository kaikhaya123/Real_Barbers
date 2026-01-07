'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface FullScreenNavProps {
  isOpen: boolean
  onClose: () => void
  navigation: { name: string; href: string }[]
  /** Optional background image path (public folder) */
  bg?: string
}

export default function FullScreenNav({ isOpen, onClose, navigation, bg = '/images/navbar-bg.jpg' }: FullScreenNavProps) {
  const pathname = usePathname()
 
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false
    return pathname === href
  }

  const getSubtitle = (name: string) => {
    switch (name.toLowerCase()) {
      case 'services':
        return 'What We Offer'
      case 'about':
        return 'Our Story'
      case 'barbers':
        return 'Your Barber'
      case 'contact':
        return 'Get In Touch'
      default:
        return 'Discover More'
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 w-screen h-screen z-[99999] overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* background image */}
          <div className="absolute inset-0 -z-10">
            <Image src="/Images/salah-regouane-rM_ev_MroKA-unsplash.jpg" alt="Menu background" fill className="object-cover" priority />
            {/* stronger black overlay + subtle blur for contrast */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" aria-hidden />
          </div>

          {/* Content (foreground) */}
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            
            {/* Header (logo removed) */}
            <div className="w-full p-4 md:p-6 lg:p-8 bg-transparent relative">
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center justify-center p-3 rounded-full text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <X className="h-6 w-6 md:h-8 md:w-8" />
              </button>

              <span className="sr-only">Pro Barber Shop ZA</span>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 flex items-center justify-center w-full h-full text-white">
              <nav aria-label="Main navigation" className="w-full max-w-4xl mx-auto px-6">
                <ul className="flex flex-col md:flex-row md:flex-wrap items-stretch justify-center gap-6 md:gap-10">
                  {navigation.map((item) => (
                    <li key={item.name} className="w-full md:w-1/2 flex items-center">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`group block w-full text-center md:text-left transition-transform duration-300 hover:scale-105 ${isActive(item.href) ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}
                      >
                        <div className="py-6 md:py-8 px-4">
                          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wider mb-1 md:mb-2">
                            {item.name}
                          </h2>
                          <p className="text-xs md:text-sm lg:text-base text-gray-200 group-hover:text-white transition-colors duration-300 tracking-wide">
                            {getSubtitle(item.name)}
                          </p>
                          <div className="mt-4 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                    </li>
                  ))}

                  <li className="w-full flex justify-center md:justify-end mt-4 md:w-full md:mt-0">
                    <Link
                      href="/book"
                      onClick={onClose}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-amber-700 transition-colors duration-200"
                    >
                      BOOK NOW
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>


          </div>
        </div>
      )}
    </>
  )
}