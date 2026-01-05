 'use client'
import { Service, Barber } from '@/lib/types'
import Button from '@/components/ui/Button'
import { format } from 'date-fns'
// Icon placeholders: put custom SVGs in `/public/Icons/` and reference them via <img>
// Example: <img src="/Icons/calendar.svg" alt="Calendar" className="h-5 w-5" />
import { BUSINESS_INFO } from '@/lib/constants'
import Image from 'next/image'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

interface BookingConfirmationProps {
  bookingId: string
  service: Service
  barber: Barber
  date: Date
  time: string
  onStartOver: () => void
}

export default function BookingConfirmation({
  bookingId,
  service,
  barber,
  date,
  time,
  onStartOver,
}: BookingConfirmationProps) {
  const lottieRef = useRef<HTMLDivElement | null>(null)
  const [lottieLoaded, setLottieLoaded] = useState(false)

  useEffect(() => {
    const refCurrent = lottieRef.current;
    if (!refCurrent) return;
    refCurrent.innerHTML = '';

    let mountedEl: HTMLElement | null = null;
    let pollId: number | null = null;

    const mountLottie = () => {
      if (typeof window === 'undefined') return false;
      const ce = (window as any).customElements;
      if (!ce || !ce.get) return false;
      if (!ce.get('lottie-player')) return false;

      mountedEl = document.createElement('lottie-player');
      mountedEl.setAttribute('src', encodeURI('/lottie/Success Tick.lottie'));
      mountedEl.setAttribute('background', 'transparent');
      mountedEl.setAttribute('speed', '1');
      mountedEl.setAttribute('style', 'width:48px;height:48px');
      mountedEl.setAttribute('loop', '');
      mountedEl.setAttribute('autoplay', '');
      // Ensure autoplay isn't blocked by browsers: set muted and call play()
      mountedEl.setAttribute('muted', '');
      refCurrent!.appendChild(mountedEl);
      // Some browsers/register may require an explicit play call
      try {
        ;(mountedEl as any).play?.()
      } catch (e) {
        // ignore play errors; mount will still be present
      }
      // Also try a brief retry after append
      setTimeout(() => {
        try {
          ;(mountedEl as any).play?.()
        } catch (e) {}
      }, 100)
      return true;
    };

    // If script already loaded, try mount immediately
    if (lottieLoaded) {
      if (!mountLottie()) {
        // poll briefly for registration
        pollId = window.setInterval(() => {
          if (mountLottie() && pollId) {
            window.clearInterval(pollId);
            pollId = null;
          }
        }, 100);
      }
    }

    return () => {
      if (mountedEl && refCurrent && refCurrent.contains(mountedEl)) {
        refCurrent.removeChild(mountedEl);
      }
      if (pollId) window.clearInterval(pollId);
    };
  }, [lottieLoaded]);

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" strategy="afterInteractive" onLoad={() => setLottieLoaded(true)} />
          <div ref={lottieRef} className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold text-primary-900 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600">
          Your appointment has been successfully scheduled
        </p>
      </div>

      {/* Booking ID */}
      <div className="bg-accent-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
        <p className="text-2xl font-bold text-accent-600">{bookingId}</p>
        <p className="text-xs text-gray-500 mt-2">
          Save this reference number for your records
        </p>
      </div>

      {/* Appointment Details */}
      <div className="bg-white border-2 border-primary-200 rounded-lg p-6 mb-6 text-left">
        <h3 className="font-bold text-primary-900 mb-4 text-center">Appointment Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Image src="/Icons/calendar (1).png" alt="Date" width={20} height={20} className="h-5 w-5 mt-0.5 flex-shrink-0 object-contain" />
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-semibold text-primary-900">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="font-semibold text-primary-900">{time}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Image src="/Icons/hairdresser.png" alt="Barber" width={20} height={20} className="h-5 w-5 mt-0.5 flex-shrink-0 object-contain" />
            <div>
              <p className="text-sm text-gray-600">Barber</p>
              <p className="font-semibold text-primary-900">{barber.name}</p>
              <p className="text-sm text-gray-500">{barber.title}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Image src="/Icons/clock.png" alt="Service time" width={20} height={20} className="h-5 w-5 mt-0.5 flex-shrink-0 object-contain" />
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-semibold text-primary-900">{service.name}</p>
              <p className="text-sm text-gray-500">{service.duration} minutes • R{service.price}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Image src="/Icons/location.png" alt="Location" width={20} height={20} className="h-5 w-5 mt-0.5 flex-shrink-0 object-contain" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-primary-900">{BUSINESS_INFO.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Info */}
      <div className="bg-white-50 border border-white-200 rounded-lg p-4 mb-6 text-left">
        <h4 className="font-semibold text-black-900 mb-2 flex items-center gap-2">
          <Image src="/Icons/chatting.png" alt="Phone" width={20} height={20} className="h-5 w-5 object-contain" />
          What&apos;s Next?
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• You&apos;ll receive a confirmation SMS shortly</li>
          <li>• We&apos;ll send a reminder 24 hours before your appointment</li>
          <li>• Please arrive 5 minutes early</li>
          <li>• Need to reschedule? Call us at {BUSINESS_INFO.phone}</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onStartOver}
        >
          Book Another Appointment
        </Button>

        <Button
          asLink
          href="/"
          variant="outline"
          size="lg"
          fullWidth
        >
          Back to Home
        </Button>
      </div>

      {/* Contact */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Need help? Contact us:</p>
        <div className="flex justify-center space-x-4">
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="flex items-center space-x-2 text-accent-600 hover:text-accent-700"
          >
            <Image src="/Icons/phone-call(1).png" alt="Call" width={16} height={16} className="h-4 w-4 object-contain" />
            <span className="text-sm font-medium">Call</span>
          </a>
          <span className="text-gray-300">|</span>
          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsapp}`}
            className="flex items-center space-x-2 text-accent-600 hover:text-accent-700"
          >
            <Image src="/Icons/whatsapp.png" alt="WhatsApp" width={16} height={16} className="h-4 w-4 object-contain" />
            <span className="text-sm font-medium">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  )
}
