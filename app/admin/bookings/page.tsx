'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Booking {
  id: string
  from: string
  service: string
  name: string | null
  dateTime: string | null
  barber: string | null
  status: string
  source: string
  createdAt: string
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [newNotification, setNewNotification] = useState('')

  useEffect(() => {
    fetchBookings()
    subscribeToRealtimeUpdates()
    
    // Also poll every 10 seconds as backup
    const interval = setInterval(fetchBookings, 10000)
    return () => clearInterval(interval)
  }, [])

  const subscribeToRealtimeUpdates = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )

      if (!supabase) {
        console.log('Supabase not configured, using polling only')
        return
      }

      setIsConnected(true)

      // Subscribe to all changes on bookings table
      const subscription = supabase
        .channel('bookings-updates')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          (payload) => {
            console.log('[Real-time Update]', payload)
            
            if (payload.eventType === 'INSERT') {
              showNotification(`New booking from ${payload.new.from}!`)
            } else if (payload.eventType === 'UPDATE') {
              showNotification(`Booking ${payload.new.id} updated to ${payload.new.status}`)
            }
            
            fetchBookings()
          }
        )
        .subscribe((status) => {
          console.log('[Supabase Subscription]', status)
          setIsConnected(status === 'SUBSCRIBED')
        })

      return () => {
        subscription.unsubscribe()
      }
    } catch (err) {
      console.log('Real-time subscriptions not available, using polling')
      setIsConnected(false)
    }
  }

  const showNotification = (message: string) => {
    setNewNotification(message)
    setTimeout(() => setNewNotification(''), 3000)
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings')
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      setBookings(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading bookings')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update booking')
      fetchBookings()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating booking')
    }
  }

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Bookings Dashboard</h1>
            <p className="text-gray-600">Manage customer appointments in real-time</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isConnected ? 'Live' : 'Polling'}
            </span>
          </div>
        </div>

        {/* Real-time Notification */}
        {newNotification && (
          <div className="mb-6 animate-in bg-blue-50 border-l-4 border-blue-500 p-4 rounded flex items-center gap-3">
            <Image
              src="/Icons/notification.png"
              alt="Notification"
              width={20}
              height={20}
            />
            <p className="text-blue-700 font-medium">{newNotification}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {(['all', 'pending', 'confirmed', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 capitalize font-medium transition ${
                filter === status
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status}
              {status !== 'all' && (
                <span className="ml-2 text-sm">
                  ({bookings.filter(b => b.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        )}

        {/* Bookings Grid */}
        {!loading && filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No {filter === 'all' ? 'bookings' : `${filter} bookings`} found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(booking => (
              <div
                key={booking.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
                    <p className="text-gray-700">{booking.name || 'Not provided'}</p>
                    <p className="text-blue-600 font-mono text-sm">{booking.from}</p>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                      <Image
                        src="/Icons/touch.png"
                        alt="Phone"
                        width={16}
                        height={16}
                      />
                      {booking.source === 'twilio' ? 'WhatsApp (Twilio)' : booking.source === 'meta' ? 'WhatsApp (Meta)' : 'Web Form'}
                    </p>
                  </div>

                  {/* Service Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Service</h3>
                    <p className="text-gray-700 text-lg font-medium mb-2 flex items-center gap-2">
                      <Image
                        src="/logo/Pro_barbershop_logo.png"
                        alt="Barber"
                        width={20}
                        height={20}
                      />
                      {booking.service}
                    </p>
                    {booking.dateTime && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <Image
                          src="/Icons/calendar-icon.svg"
                          alt="Date"
                          width={16}
                          height={16}
                        />
                        {new Date(booking.dateTime).toLocaleString()}
                      </p>
                    )}
                    {booking.barber && (
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <Image
                          src="/Icons/user.png"
                          alt="Barber"
                          width={16}
                          height={16}
                        />
                        Preferred: {booking.barber}
                      </p>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                    <div className="mb-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
                      >
                        ✓ Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
                      >
                        ✕ Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'completed')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
                    >
                      ✓ Completed
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <div className="flex-1 text-center py-2 text-gray-600">
                      Appointment completed
                    </div>
                  )}
                  {booking.status === 'cancelled' && (
                    <div className="flex-1 text-center py-2 text-red-600">
                      Appointment cancelled
                    </div>
                  )}

                  {/* WhatsApp Link */}
                  <a
                    href={`https://wa.me/${booking.from.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition flex items-center justify-center"
                  >
                    <Image
                      src="/Icons/whatsapp.png"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
