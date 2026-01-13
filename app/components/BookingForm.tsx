'use client';

import { useState } from 'react';
import BookingConfirmation from './BookingConfirmation';
import { buildWhatsAppLink, buildBookingMessage } from '@/lib/whatsapp';
import { BUSINESS_INFO } from '@/lib/constants';

interface ConfirmationData {
  bookingId: string;
  queueNumber: string;
  service: string;
  name: string;
}

export default function BookingForm() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);

  const handleBookingSuccess = (data: ConfirmationData) => {
    setConfirmationData(data);
    setShowConfirmation(true);

    // Redirect after 7 seconds (matches BookingConfirmation timeout)
    setTimeout(() => {
      window.location.href = '/queue';
    }, 7000);
  };

  const handleWhatsAppContact = () => {
    console.log('WhatsApp button clicked');
    
    // Show the loading animation
    const bookingData: ConfirmationData = {
      bookingId: `BK${Date.now() % 10000}`,
      queueNumber: 'Pending',
      service: 'Barbershop Service',
      name: 'Guest',
    };
    
    handleBookingSuccess(bookingData);
    
    // Open WhatsApp after a short delay to show animation
    setTimeout(() => {
      const whatsappUrl = buildWhatsAppLink(
        BUSINESS_INFO.whatsapp,
        buildBookingMessage({
          serviceName: 'Barbershop Service',
          name: 'Customer',
        })
      );
      window.open(whatsappUrl, '_blank');
    }, 500);
  };

  return (
    <>
      {showConfirmation && confirmationData && (
        <BookingConfirmation
          bookingId={confirmationData.bookingId}
          queueNumber={confirmationData.queueNumber}
          serviceName={confirmationData.service}
          customerName={confirmationData.name}
        />
      )}

      {/* Find your WhatsApp button and replace it with this: */}
      <button
        type="button"
        onClick={handleWhatsAppContact}
        className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition"
      >
        Contact via WhatsApp
      </button>

      {/* ...existing form code... */}
    </>
  );
}
