"use client"

import Image from 'next/image'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { useState } from 'react'

export default function Services() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const services = [
    {
      id: 1,
      name: 'High Fade & Dye',
      price: 150,
      duration: '45 min',
      image: '/Images/1767342932205.jpeg',
      description: 'Traditional haircut with modern finishing touches'
    },
    {
      id: 2,
      name: 'Taper Fade & Dye',
      price: 150,
      duration: '60 min', 
      image: '/Images/1767374000777.jpeg',
      description: 'Precision fade with personalized styling'
    },
    {
      id: 3,
      name: 'Kiddies haircut & Style',
      price: 80,
      duration: '30 min',
      image: '/Images/1767445437127.jpeg',
      description: 'Professional beard shaping and grooming'
    },
    {
      id: 4,
      name: 'Plain Fade',
      price: 60,
      duration: '45 min',
      image: '/Images/1767446038566.jpeg',
      description: 'Traditional wet shave with hot towel treatment'
    },
    {
      id: 5,
      name: 'Chiskop',
      price: 50,
      duration: '20 min',
      image: '/Images/1767447027320.jpeg',
      description: 'Deep cleanse with premium products'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(services.length / 2))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(services.length / 2)) % Math.ceil(services.length / 2))
  }

  const visibleServices = services.slice(currentSlide * 2, (currentSlide + 1) * 2)

  return (
    <Section background="white" padding="lg">
      <div className="max-w-7xl mx-auto">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Text Content */}
          <div>
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-900 mb-6 leading-tight tracking-wide">
                Our Professional<br />
                Services
              </h2>
              <p className="text-base md:text-lg text-dark-600 mb-6 leading-relaxed">
                Choose from our range of premium grooming services, each delivered with precision and care by our experienced barbers.
              </p>
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-black text-dark-900 mb-2 tracking-wide">
                  Quality You Can Trust.
                </h3>
                <h3 className="text-2xl md:text-3xl font-black text-accent-600 tracking-wide">
                  Style You&#39;ll Love.
                </h3>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex items-center space-x-4 mb-6">
                <Button 
                  onClick={prevSlide}
                  variant="outline" 
                  size="sm"
                  className="border-dark-200 text-dark-700 hover:bg-dark-900 hover:text-white hover:border-dark-900"
                >
                  ←
                </Button>
                <Button 
                  onClick={nextSlide}
                  variant="outline" 
                  size="sm"
                  className="border-dark-200 text-dark-700 hover:bg-dark-900 hover:text-white hover:border-dark-900"
                >
                  →
                </Button>
                <div className="flex space-x-2">
                  {Array.from({ length: Math.ceil(services.length / 2) }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-dark-900' : 'bg-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <Button 
                asLink 
                href="/book" 
                variant="primary" 
                size="lg"
                className="bg-accent-600 hover:bg-accent-700"
              >
                Book Your Service →
              </Button>
            </div>
          </div>

          {/* Right Side - Swipeable Service Cards */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500">
              {visibleServices.map((service, index) => (
                <div key={service.id} className="group cursor-pointer">
                  <div className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-[400px] w-full rounded-lg">
                    {/* Service Image */}
                    <div className="relative h-[400px] overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>
                      
                      {/* Service Info - Bottom Left Corner */}
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-2xl font-black text-white mb-1 tracking-wide">
                          {service.name}
                        </h3>
                        <div className="text-3xl font-black text-white tracking-wide">
                          R{service.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
