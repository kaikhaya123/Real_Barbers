"use client"

import Image from 'next/image'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { useState } from 'react'

// Auto-fallback icon component
const IconWithFallback = ({ src, alt, fallback, className, color }: { 
  src: string; 
  alt: string; 
  fallback: React.ReactNode; 
  className?: string;
  color: string;
}) => {
  const [imageError, setImageError] = useState(false)
  
  if (imageError) {
    return (
      <div className={`${className} ${
        color === 'accent' ? 'text-accent-600' : 'text-primary-600'
      }`}>
        {fallback}
      </div>
    )
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={32}
      height={32}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}

export default function HowItWorks() {
  const methods = [
    {
      iconPath: '/Icons/calendar.png',
      fallbackIcon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Book an Appointment',
      description: 'Choose your service, select your preferred barber, and pick a time that works for you. Get instant confirmation.',
      steps: ['Select service', 'Choose barber & time', 'Confirm booking'],
      color: 'accent',
    },
    {
      iconPath: '/Icons/line.png',
      fallbackIcon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      title: 'Join Walk-In Queue',
      description: 'No appointment? No problem. Join our digital queue and track your position in real-time from anywhere.',
      steps: ['Join the queue', 'See your position', 'Get notified'],
      color: 'primary',
    },
  ]

  return (
    <Section background="gray">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-900 mb-4">
          Two Ways to Get Your Cut
        </h2>
        <p className="text-lg text-dark-600 max-w-2xl mx-auto">
          We respect your time. Choose the option that works best for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {methods.map((method) => (
          <Card key={method.title} hover>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              method.color === 'accent' ? 'bg-accent-100' : 'bg-primary-100'
            } mb-6`}>
              <IconWithFallback
                src={method.iconPath}
                alt={`${method.title} icon`}
                fallback={method.fallbackIcon}
                className="w-8 h-8"
                color={method.color}
              />
            </div>

            <h3 className="text-2xl font-heading font-bold text-primary-900 mb-3">
              {method.title}
            </h3>

            <p className="text-gray-600 mb-6">
              {method.description}
            </p>

            <div className="space-y-3">
              {method.steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <IconWithFallback
                    src="/Images/check-icon.png"
                    alt="Check icon"
                    fallback={
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    }
                    className="w-5 h-5 flex-shrink-0"
                    color="green"
                  />
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 max-w-3xl mx-auto">
          <strong>Still prefer calling?</strong> That&apos;s fine too. We accept phone bookings during business hours. 
          Our digital system helps us serve you better while keeping things flexible.
        </p>
      </div>
    </Section>
  )
}
