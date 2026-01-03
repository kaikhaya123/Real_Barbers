'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { useState, useEffect } from 'react'

export default function IntroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Array of community images with captions
  const communityImages = [
    {
      src: '/Images/1767456426218.jpeg',
      caption: 'Fresh Cuts, Fresh Confidence',
      alt: 'Community member enjoying fresh cut'
    },
    {
      src: '/Images/1767456420453.jpeg', 
      caption: 'Professional Excellence',
      alt: 'Professional grooming service'
    },
    {
      src: '/Images/1767374000777.jpeg',
      caption: 'Building Community Bonds', 
      alt: 'Community gathering at barbershop'
    },
    {
      src: '/Images/1767457177038.jpeg',
      caption: 'Transforming Lives',
      alt: 'Another community transformation'
    },
    {
      src: '/Images/1767457235355.jpeg',
      caption: 'Style & Confidence',
      alt: 'Stylish haircut showcase'
    }
  ]

  // Auto-cycle through images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % communityImages.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [communityImages.length])
  return (
    <section
      className="bg-cream-50 py-20 md:py-28 font-sans"
      role="region"
      aria-labelledby="intro-heading"
    >
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[75vh]">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            <div className="space-y-5">
              <h2
                id="intro-heading"
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-dark-900 leading-tight"
              >
                More than a haircut.
                <span className="block text-dark-600 text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold">
                  It&#39;s a culture.
                </span>
              </h2>

              <p className="text-lg md:text-xl text-dark-700 leading-relaxed max-w-lg">
                Premium haircuts by skilled barbers in Lamontville. Clean fades,
                precise grooming, modern style.
              </p>
            </div>

            {/* Key Points */}
            <ul className="space-y-3 max-w-md">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-dark-900 rounded-full mt-2" />
                <span className="text-dark-800 font-medium">
                  Experienced professional barbers
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-dark-900 rounded-full mt-2" />
                <span className="text-dark-800 font-medium">
                  Premium tools and products
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-dark-900 rounded-full mt-2" />
                <span className="text-dark-800 font-medium">
                  Comfortable, welcoming space
                </span>
              </li>
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                href="/book"
                size="lg"
                variant="primary"
                className="w-full sm:w-auto"
              >
                Book Appointment
              </Button>
              <Button
                href="/barbers"
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Meet the Barbers
              </Button>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative h-[520px] md:h-[650px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/Images/real_barbershop_za_1767437611547.png"
                alt="Barber performing a clean fade haircut"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Community Impact Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24"
        >
          <div className="flex justify-center">
            <div className="relative aspect-[16/10] w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl bg-gray-100 group">
              <Image
                key={currentImageIndex}
                src={communityImages[currentImageIndex].src}
                alt={communityImages[currentImageIndex].alt}
                fill
                className="object-cover transition-all duration-700 ease-in-out"
                sizes="(max-width: 768px) 95vw, (max-width: 1024px) 80vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Caption with better positioning */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-cream-50 font-bold text-xl md:text-2xl mb-2 drop-shadow-lg">
                  {communityImages[currentImageIndex].caption}
                </p>
                
                {/* Image indicators */}
                <div className="flex justify-center space-x-2">
                  {communityImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-cream-50 scale-110' 
                          : 'bg-cream-50/50 hover:bg-cream-50/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Navigation arrows */}
              <button
                onClick={() => setCurrentImageIndex((prev) => prev === 0 ? communityImages.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % communityImages.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
