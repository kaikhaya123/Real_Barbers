'use client'

import { useState, useEffect } from 'react'
import { Service, Barber } from '@/lib/types'
import Button from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { format, addDays, isToday, isTomorrow, startOfDay } from 'date-fns'
import { TIME_SLOTS, OPERATING_HOURS } from '@/lib/constants'

interface DateTimeSelectorProps {
  service: Service
  barber: Barber
  onSelect: (date: Date, time: string) => void
  onBack: () => void
}

export default function DateTimeSelector({ service, barber, onSelect, onBack }: DateTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Generate next 7 days
  useEffect(() => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(new Date(), i))
    }
    setAvailableDates(dates)
  }, [])

  // Get available time slots for selected date
  useEffect(() => {
    if (!selectedDate) return

    const dayOfWeek = selectedDate.getDay()
    const hours = OPERATING_HOURS[dayOfWeek]
    
    // Filter slots based on operating hours
    const filtered = TIME_SLOTS.filter(slot => {
      return slot >= hours.open && slot <= hours.close
    })

    // If today, filter out past times
    if (isToday(selectedDate)) {
      const currentHour = new Date().getHours()
      const currentMinute = new Date().getMinutes()
      const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
      
      setAvailableSlots(filtered.filter(slot => slot > currentTime))
    } else {
      setAvailableSlots(filtered)
    }

    setSelectedTime(null)
  }, [selectedDate])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime)
    }
  }

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'EEE')
  }

  return (
    <div>
      <div className="mb-6">
        <button onClick={onBack} className="text-accent-600 hover:text-accent-700 mb-3">
          ← Back to barbers
        </button>
        <h2 className="text-2xl font-bold text-primary-900 mb-2">
          Select Date & Time
        </h2>
        <p className="text-gray-600">
          {service.name} with {barber.name}
        </p>
      </div>

      {/* Date Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Choose a Date</h3>
        <div className="grid grid-cols-7 gap-2">
          {availableDates.map((date) => {
            const isSelected = startOfDay(date).getTime() === startOfDay(selectedDate).getTime()
            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateSelect(date)}
                className={`p-3 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'bg-accent-600 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="text-xs font-semibold">{getDateLabel(date)}</div>
                <div className="text-lg font-bold mt-1">{format(date, 'd')}</div>
                <div className="text-xs">{format(date, 'MMM')}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">
          Choose a Time
          <span className="ml-2 text-sm text-gray-600 font-normal">
            ({availableSlots.length} slots available)
          </span>
        </h3>
        
        {availableSlots.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {availableSlots.map((time) => {
              const isSelected = time === selectedTime
              return (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-lg text-center font-semibold transition-all ${
                    isSelected
                      ? 'bg-accent-600 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No available slots for this date</p>
            <p className="text-sm mt-1">Please select another date</p>
          </div>
        )}
      </div>

      {/* Summary & Continue */}
      {selectedTime && (
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your appointment:</p>
              <p className="font-semibold text-primary-900">
                {format(selectedDate, 'EEEE, MMMM d')} at {selectedTime}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Duration:</p>
              <p className="font-semibold text-primary-900">{service.duration} min</p>
            </div>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleContinue}
        disabled={!selectedTime}
      >
        Continue to Details
      </Button>
    </div>
  )
}
