'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Booking {
  id: string
  bookingid: string
  phone: string
  service: string
  name: string | null
  date: string | null
  time: string | null
  barber: string | null
  queuenumber: string | null
  status: string
  source: string
  createdat: string
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('pending')
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('today')
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

  const getDateRange = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    switch (dateFilter) {
      case 'today':
        return { start: today, end: tomorrow }
      case 'yesterday':
        return { start: yesterday, end: today }
      case 'week':
        return { start: weekAgo, end: tomorrow }
      case 'month':
        return { start: monthAgo, end: tomorrow }
      default:
        return { start: new Date(0), end: new Date(9999, 0, 1) }
    }
  }

  const filterByDateAndStatus = (bookings: Booking[]) => {
    const { start, end } = getDateRange()
    
    return bookings.filter(b => {
      // Filter by status
      if (filter !== 'all' && b.status !== filter) return false
      
      // Filter by date (using the date field if available)
      if (b.date) {
        const bookingDate = new Date(b.date)
        bookingDate.setHours(0, 0, 0, 0)
        if (bookingDate < start || bookingDate >= end) return false
      }
      
      return true
    })
  }

  const filtered = filterByDateAndStatus(bookings)

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1">Bookings</h1>
            <p className="text-xs sm:text-sm text-gray-600">Manage appointments in real-time</p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="font-medium text-gray-700">
              {isConnected ? 'Live' : 'Polling'}
            </span>
          </div>
        </div>

        {/* Real-time Notification */}
        {newNotification && (
          <div className="mb-4 animate-in bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded flex items-center gap-2 sm:gap-3 text-sm">
            <Image
              src="/Icons/notification.png"
              alt="Notification"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <p className="text-blue-700 font-medium">{newNotification}</p>
          </div>
        )}

        {/* Filter Section - Mobile Optimized */}
        <div className="mb-6 bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          {/* Status Filter */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Status:</p>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'pending', 'confirmed', 'completed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 capitalize font-medium text-xs sm:text-sm transition rounded whitespace-nowrap ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'pending' ? 'Pending' : status === 'confirmed' ? 'Done' : 'Completed'}
                  <span className="ml-1 text-xs hidden sm:inline">
                    ({bookings.filter(b => b.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Date:</p>
            <div className="flex gap-1.5 flex-wrap">
              {(['today', 'yesterday', 'week', 'month', 'all'] as const).map(date => (
                <button
                  key={date}
                  onClick={() => setDateFilter(date)}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 capitalize font-medium text-xs sm:text-sm transition rounded whitespace-nowrap flex items-center gap-1 ${
                    dateFilter === date
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {date === 'today' && (
                    <Image
                      src="/Icons/calendar (2).png"
                      alt="Calendar"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  )}
                  {date === 'today' ? 'Today' : date === 'yesterday' ? 'Yesterday' : date === 'week' ? 'Week' : date === 'month' ? 'Month' : 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 sm:mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-sm">Loading bookings...</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">No {filter === 'all' ? 'bookings' : `${filter} bookings`} found</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filtered.map(booking => (
              <div
                key={booking.id}
                className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition"
              >
                {/* Queue Number Badge */}
                {booking.queuenumber && (
                  <div className="mb-3 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-lg">
                    {booking.queuenumber}
                  </div>
                )}

                {/* Mobile Stacked Layout */}
                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 mb-4">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Customer</h3>
                    <p className="text-gray-700 text-sm font-medium">{booking.name || 'Not provided'}</p>
                    <p className="text-blue-600 font-mono text-xs break-all">{booking.phone}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {booking.source === 'twilio' ? 'WhatsApp' : booking.source === 'meta' ? 'WhatsApp' : 'Web'}
                    </p>
                  </div>

                  {/* Service Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Service</h3>
                    <p className="text-gray-700 text-sm font-medium">{booking.service}</p>
                    {booking.date && booking.time && (
                      <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                        <Image
                          src="/Icons/calendar (2).png"
                          alt="Date"
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5"
                        />
                        {booking.date} at {booking.time}
                      </p>
                    )}
                    {booking.barber && (
                      <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                        <Image
                          src="/Icons/user.png"
                          alt="Barber"
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5"
                        />
                        {booking.barber}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Status</h3>
                    <span
                      className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
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
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(booking.createdat).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Mobile Optimized */}
                <div className="flex gap-2 pt-3 sm:pt-4 border-t border-gray-200 flex-wrap">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.bookingid, 'confirmed')}
                        className="flex-1 min-w-[100px] bg-green-600 hover:bg-green-700 text-white font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded transition text-sm sm:text-base flex items-center justify-center gap-1"
                      >
                        <Image
                          src="/Icons/approval-symbol-in-badge.png"
                          alt="Confirm"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking.bookingid, 'cancelled')}
                        className="flex-1 min-w-[100px] bg-red-600 hover:bg-red-700 text-white font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded transition text-sm sm:text-base flex items-center justify-center gap-1"
                      >
                        <Image
                          src="/Icons/multiply.png"
                          alt="Cancel"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(booking.bookingid, 'completed')}
                      className="flex-1 min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded transition text-sm sm:text-base flex items-center justify-center gap-1"
                    >
                      <Image
                        src="/Icons/checked.png"
                        alt="Done"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      Done
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <div className="flex-1 text-center py-2 text-green-600 font-medium text-sm flex items-center justify-center gap-1">
                      <Image
                        src="/Icons/check.png"
                        alt="Completed"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      Completed
                    </div>
                  )}
                  {booking.status === 'cancelled' && (
                    <div className="flex-1 text-center py-2 text-red-600 font-medium text-sm flex items-center justify-center gap-1">
                      <Image
                        src="/Icons/multiply.png"
                        alt="Cancelled"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      Cancelled
                    </div>
                  )}

                  {/* WhatsApp Link */}
                  <a
                    href={`https://wa.me/${booking.phone.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded transition flex items-center justify-center min-w-[44px] h-[44px] sm:h-auto"
                    title="Contact via WhatsApp"
                  >
                    <Image
                      src="/Icons/whatsapp.png"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-6 sm:mt-8 text-center sm:text-left">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
            ← Back
          </Link>
        </div>
      </div>
    </div>
  )
}
