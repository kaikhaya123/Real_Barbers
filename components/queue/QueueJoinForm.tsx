'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { User, Phone, Users } from 'lucide-react'
import { BARBERS } from '@/lib/constants'

interface QueueJoinFormProps {
  onJoin: (formData: any) => void
}

export default function QueueJoinForm({ onJoin }: QueueJoinFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredBarberId: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onJoin(formData)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-2">
          Join the Queue
        </h2>
        <p className="text-gray-600">
          Enter your details to secure your spot
        </p>
      </div>

      {/* Current Queue Info */}
      <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Wait Time</p>
            <p className="text-2xl font-bold text-accent-600">~25 min</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">People in Queue</p>
            <p className="text-2xl font-bold text-accent-600">3</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your full name"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0XX XXX XXXX"
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          <p className="mt-1 text-xs text-gray-500">
            We&apos;ll send you an SMS when it&apos;s almost your turn
          </p>
        </div>

        <div>
          <label htmlFor="preferredBarberId" className="block text-sm font-semibold text-gray-700 mb-2">
            Preferred Barber (Optional)
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="preferredBarberId"
              name="preferredBarberId"
              value={formData.preferredBarberId}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none appearance-none bg-white"
            >
              <option value="">No preference (faster service)</option>
              {BARBERS.filter(b => b.available).map(barber => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Selecting a specific barber may increase your wait time
          </p>
        </div>

        <div className="pt-4">
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Join Queue Now
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500">
          By joining, you agree to receive queue updates via SMS
        </p>
      </form>
    </div>
  )
}
