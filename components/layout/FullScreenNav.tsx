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
          className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-white z-[99999]" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'white',
            zIndex: 99999
          }}
        >
          {/* Content */}
          <div className="relative w-full h-full flex flex-col bg-white overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 md:p-8 lg:p-12 bg-white w-full">
              <button
                onClick={onClose}
                className="flex items-center space-x-3 text-gray-900 hover:text-gray-700 transition-colors duration-300 group"
              >
                <X className="h-6 w-6 md:h-8 md:w-8 transition-transform duration-300 group-hover:rotate-90" />
                <span className="text-lg md:text-xl font-medium tracking-wide">Close</span>
              </button>
              
              <div className="text-center">
                <Image
                  src="/logo/Real_barbersho_logo.png"
                  alt="Real Barbershop"
                  width={120}
                  height={120}
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain mx-auto"
                />
                <p className="text-sm md:text-base text-gray-600 mt-2 tracking-wide">
                  PREMIUM GROOMING EXPERIENCE
                </p>
              </div>
              
              <div className="w-24 md:w-32" /> {/* Spacer for center alignment */}
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
                      className="group block text-center md:text-left transition-all duration-500 hover:scale-105 text-gray-900 hover:text-amber-600"
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

            {/* Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-8 lg:p-12 border-t border-gray-300 bg-white">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Image
                  src="/logo/Real_barbersho_logo.png"
                  alt="Real Barbershop"
                  width={60}
                  height={60}
                  className="h-12 w-auto object-contain opacity-90"
                />
                <div className="text-gray-900">
                  <p className="text-sm font-medium">Durban, KZN</p>
                  <p className="text-xs text-gray-600">Premium Barber Services</p>
                </div>
              </div>
              
              <div className="flex space-x-6 text-sm text-gray-600">
                <a href="tel:+27123456789" className="hover:text-gray-900 transition-colors duration-300">
                  Call Us
                </a>
                <span>•</span>
                <a href="mailto:info@realbarbershop.co.za" className="hover:text-gray-900 transition-colors duration-300">
                  Email
                </a>
                <span>•</span>
                <span className="text-amber-600">Open Daily</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}