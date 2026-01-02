'use client'

import { useState } from 'react'
import Section from '@/components/ui/Section'
import ServiceSelector from '@/components/booking/ServiceSelector'
import BarberSelector from '@/components/booking/BarberSelector'
import DateTimeSelector from '@/components/booking/DateTimeSelector'
import BookingForm from '@/components/booking/BookingForm'
import BookingConfirmation from '@/components/booking/BookingConfirmation'
import { Service, Barber } from '@/lib/types'

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber)
    setStep(3)
  }

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setStep(4)
  }

  const handleBookingSubmit = (formData: any) => {
    // In production, this would call an API
    const newBookingId = `BK-${Date.now()}`
    setBookingId(newBookingId)
    setStep(5)
  }

  const handleStartOver = () => {
    setStep(1)
    setSelectedService(null)
    setSelectedBarber(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setBookingId(null)
  }

  return (
    <Section background="gray" padding="lg">
      <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-3">
        Book Your Appointment
        </h1>
        <p className="text-gray-600">
        Choose your service, barber, and preferred time in just a few clicks
        </p>
      </div>

        {/* Progress Indicator */}
        {step < 5 && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s <= step
                        ? 'bg-accent-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`w-16 md:w-24 h-1 ${
                        s < step ? 'bg-accent-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between max-w-2xl mx-auto mt-2 text-xs md:text-sm text-gray-600">
              <span>Service</span>
              <span>Barber</span>
              <span>Date & Time</span>
              <span>Details</span>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {step === 1 && <ServiceSelector onSelect={handleServiceSelect} />}
          
          {step === 2 && selectedService && (
            <BarberSelector
              service={selectedService}
              onSelect={handleBarberSelect}
              onBack={() => setStep(1)}
            />
          )}
          
          {step === 3 && selectedService && selectedBarber && (
            <DateTimeSelector
              service={selectedService}
              barber={selectedBarber}
              onSelect={handleDateTimeSelect}
              onBack={() => setStep(2)}
            />
          )}
          
          {step === 4 && selectedService && selectedBarber && selectedDate && selectedTime && (
            <BookingForm
              service={selectedService}
              barber={selectedBarber}
              date={selectedDate}
              time={selectedTime}
              onSubmit={handleBookingSubmit}
              onBack={() => setStep(3)}
            />
          )}
          
          {step === 5 && bookingId && selectedService && selectedBarber && selectedDate && selectedTime && (
            <BookingConfirmation
              bookingId={bookingId}
              service={selectedService}
              barber={selectedBarber}
              date={selectedDate}
              time={selectedTime}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </div>
    </Section>
  )
}
