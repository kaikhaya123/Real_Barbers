'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import FullScreenNav from './FullScreenNav'

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'SERVICES', href: '/#services' },
    { name: 'ABOUT', href: '/#about' },
    { name: 'BARBERS', href: '/barbers' },
    { name: 'CONTACT', href: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // Change navbar when scrolled past 50px
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false
    return pathname === href
  }

  const isHomePage = pathname === '/'

  return (
     <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
       isScrolled || !isHomePage 
         ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100' 
         : 'bg-transparent'
     }`}>
          <div className="mx-auto max-w-7xl">
            <nav className={`flex items-center justify-between px-6 lg:px-8 transition-all duration-300 ${
              isScrolled || !isHomePage ? 'py-3' : 'py-4'
            }`}>
              {/* Logo/Brand */}
              <div className="flex items-center">
                <Link href="/">
                  <Image
                    src="/logo/Real_barbersho_logo.png"
                    alt="Real Barbershop Logo"
                    width={220}
                    height={75}
                    className={`w-auto transition-all duration-300 ${
                      isScrolled || !isHomePage 
                        ? 'h-12 md:h-14 lg:h-16' 
                        : 'h-16 md:h-18 lg:h-20'
                    }`}
                    priority
                  />
                </Link>
              </div>
          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium tracking-wide transition-all duration-300 ${
                  isActive(item.href)
                    ? (isScrolled || !isHomePage ? 'text-gray-900' : 'text-white')
                    : (isScrolled || !isHomePage 
                        ? 'text-gray-600 hover:text-gray-900' 
                        : 'text-white/90 hover:text-white')
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - CTA & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop CTA */}
            <Link
              href="/book"
              className={`hidden md:inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                isScrolled || !isHomePage
                  ? 'border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                  : 'border border-white text-white hover:bg-white hover:text-gray-900'
              }`}
            >
              <span>BOOK NOW</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled || !isHomePage
                  ? 'text-gray-900 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Full Screen Navigation */}
      <FullScreenNav 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        navigation={navigation} 
      />
    </header>
  )
}
