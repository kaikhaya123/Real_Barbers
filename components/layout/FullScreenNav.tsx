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
}

export default function FullScreenNav({ isOpen, onClose, navigation }: FullScreenNavProps) {
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

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-white z-[99999] overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Content */}
          <div className="relative w-full h-full flex flex-col bg-white overflow-hidden">
            
            {/* Header */}
            <div className="w-full p-6 md:p-8 lg:p-12 bg-white relative">
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-gray-700 transition-colors duration-300"
              >
                <X className="h-6 w-6 md:h-8 md:w-8" />
              </button>

              <div className="flex justify-center">
                <Image
                  src="/logo/Real_barbersho_logo.png"
                  alt="Real Barbershop"
                  width={140}
                  height={140}
                  className="h-12 md:h-16 lg:h-20 w-auto object-contain"
                />
              </div>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 flex items-center justify-center bg-white w-full h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-10 max-w-4xl mx-auto px-6 w-full">
                {navigation.map((item, index) => {
                  // Default subtitles for navigation items
                  const getSubtitle = (name: string) => {
                    switch (name.toLowerCase()) {
                      case 'services': return 'What We Offer'
                      case 'about': return 'Our Story'
                      case 'barbers': return 'Meet The Team'
                      case 'contact': return 'Get In Touch'
                      default: return 'Discover More'
                    }
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`group block text-center md:text-left transition-all duration-500 hover:scale-105 ${isActive(item.href) ? 'text-amber-600' : 'text-gray-900 hover:text-amber-600'}`}
                    >
                      <div className="relative">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wider mb-1 md:mb-2">
                          {item.name}
                        </h2>
                        <p className="text-xs md:text-sm lg:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300 tracking-wide">
                          {getSubtitle(item.name)}
                        </p>
                        
                        {/* Animated underline */}
                        <div className="absolute bottom-0 left-0 md:left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </div>
                    </Link>
                  )
                })}
                
                {/* Add Book Now as additional menu item for mobile */}
                <Link
                  href="/book"
                  onClick={onClose}
                  className="group block text-center md:text-left transition-all duration-500 hover:scale-105 text-gray-900 hover:text-amber-600 md:col-span-2 mt-6"
                >
                  <div className="relative">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wider mb-1 md:mb-2">
                      BOOK NOW
                    </h2>
                    <p className="text-xs md:text-sm lg:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300 tracking-wide">
                      Reserve Your Spot
                    </p>
                    
                    {/* Animated underline */}
                    <div className="absolute bottom-0 left-0 md:left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </Link>
              </div>
            </div>


          </div>
        </div>
      )}
    </>
  )
}