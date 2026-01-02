import { Service, Barber } from '@/lib/types'
import Button from '@/components/ui/Button'
import { format } from 'date-fns'
import { CheckCircle, Calendar, User, Clock, MapPin, Phone } from 'lucide-react'
import { BUSINESS_INFO } from '@/lib/constants'

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
  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
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
            <Calendar className="h-5 w-5 text-accent-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-semibold text-primary-900">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="font-semibold text-primary-900">{time}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-accent-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Barber</p>
              <p className="font-semibold text-primary-900">{barber.name}</p>
              <p className="text-sm text-gray-500">{barber.title}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-accent-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-semibold text-primary-900">{service.name}</p>
              <p className="text-sm text-gray-500">{service.duration} minutes • R{service.price}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-accent-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-primary-900">{BUSINESS_INFO.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
        <h4 className="font-semibold text-blue-900 mb-2">📱 What's Next?</h4>
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
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">Call</span>
          </a>
          <span className="text-gray-300">|</span>
          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsapp}`}
            className="flex items-center space-x-2 text-accent-600 hover:text-accent-700"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  )
}
