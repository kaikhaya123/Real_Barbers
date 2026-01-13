'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/public/lottie/loading.lottie';
import successAnimation from '@/public/lottie/success-tick.lottie';

interface BookingConfirmationProps {
  bookingId: string;
  queueNumber: string;
  serviceName: string;
  customerName: string;
}

export default function BookingConfirmation({
  bookingId,
  queueNumber,
  serviceName,
  customerName,
}: BookingConfirmationProps) {
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('BookingConfirmation mounted, isLoading:', isLoading);

    // Show loading for 2 seconds, then show success
    const loadingTimer = setTimeout(() => {
      console.log('Switching to success state');
      setIsLoading(false);
    }, 2000);

    // Hide confirmation after 7 seconds total
    const confirmationTimer = setTimeout(() => {
      console.log('Hiding confirmation');
      setShowConfirmation(false);
    }, 7000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(confirmationTimer);
    };
  }, []);

  console.log('Rendering - showConfirmation:', showConfirmation, 'isLoading:', isLoading);

  if (!showConfirmation) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        {/* Loading Animation */}
        {isLoading && (
          <>
            <div style={{ height: 150, width: 150, margin: '0 auto', backgroundColor: '#f0f0f0' }}>
              <Lottie
                animationData={loadingAnimation}
                loop={true}
                autoplay={true}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
            <p className="text-gray-600 font-semibold mt-4">Processing your booking...</p>
          </>
        )}

        {/* Success Animation */}
        {!isLoading && (
          <>
            <Lottie
              animationData={successAnimation}
              loop={false}
              autoplay={true}
              style={{ height: 150, width: 150, margin: '0 auto' }}
            />

            <h2 className="text-2xl font-bold text-green-600 mt-6">Booking Confirmed!</h2>
            <p className="text-gray-700 mt-2">
              Thank you, <strong>{customerName}</strong>
            </p>

            <div className="mt-6 space-y-3 text-left bg-gray-50 p-4 rounded">
              <p><strong>Service:</strong> {serviceName}</p>
              <p><strong>Queue Number:</strong> <span className="text-xl font-bold text-blue-600">{queueNumber}</span></p>
              <p><strong>Booking ID:</strong> {bookingId}</p>
            </div>

            <p className="text-sm text-gray-500 mt-4">Redirecting in a few seconds...</p>
          </>
        )}
      </div>
    </div>
  );
}