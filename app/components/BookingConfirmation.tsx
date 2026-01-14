'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Lottie must be client-only
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface BookingConfirmationProps {
  bookingId: string
  queueNumber: string
  serviceName: string
  customerName: string
}

export default function BookingConfirmation({
  bookingId,
  queueNumber,
  serviceName,
  customerName,
}: BookingConfirmationProps) {
  const [visible, setVisible] = useState(true)
  const [stage, setStage] = useState<'loading' | 'success'>('loading')
  const [loadingAnimation, setLoadingAnimation] = useState<any>(null)
  const [successAnimation, setSuccessAnimation] = useState<any>(null)

  // Load animations once
  useEffect(() => {
    const loadAnimations = async () => {
      const loading = await import('@/public/animations/loading.json')
      const success = await import('@/public/animations/success.json')

      setLoadingAnimation(loading.default)
      setSuccessAnimation(success.default)
    }

    loadAnimations()
  }, [])

  // Control flow timing
  useEffect(() => {
    if (!loadingAnimation || !successAnimation) return

    const loadingTimer = setTimeout(() => {
      setStage('success')
    }, 2000)

    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, 7000)

    return () => {
      clearTimeout(loadingTimer)
      clearTimeout(hideTimer)
    }
  }, [loadingAnimation, successAnimation])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-8 text-center max-w-md w-full mx-4 shadow-2xl">
        <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          {stage === 'loading' && loadingAnimation && (
            <Lottie
              key="loading"
              animationData={loadingAnimation}
              loop
              autoplay
              style={{ width: 128, height: 128 }}
            />
          )}

          {stage === 'success' && successAnimation && (
            <Lottie
              key="success"
              animationData={successAnimation}
              loop={false}
              autoplay
              style={{ width: 128, height: 128 }}
            />
          )}
        </div>

        {stage === 'loading' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Processing your booking
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your appointment
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Booking confirmed
            </h2>
            <p className="text-gray-600 mb-2">
              Booking ID: <span className="font-semibold">{bookingId}</span>
            </p>
            <p className="text-gray-600 mb-2">
              Service: <span className="font-semibold">{serviceName}</span>
            </p>
            <p className="text-gray-600 mb-4">
              Queue number: <span className="font-semibold">{queueNumber}</span>
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to queue
            </p>
          </>
        )}
      </div>
    </div>
  )
}
