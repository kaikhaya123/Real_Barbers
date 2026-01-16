'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  source: string
  createdat: string
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | Booking['status']>('all')
  const [rangeFilter, setRangeFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('today')
  const [selectedDate, setSelectedDate] = useState<string>('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* ---------------- FETCH ---------------- */

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/bookings')
      if (!res.ok) throw new Error('Failed to load bookings')
      setBookings(await res.json())
      setError('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  /* ---------------- DATE LOGIC ---------------- */

  const todayISO = new Date().toISOString().split('T')[0]

  const rangeDates = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(end.getDate() + 1)

    if (rangeFilter === 'yesterday') {
      const y = new Date(start)
      y.setDate(y.getDate() - 1)
      return { start: y, end: start }
    }

    if (rangeFilter === 'week') {
      const w = new Date(start)
      w.setDate(w.getDate() - 7)
      return { start: w, end }
    }

    if (rangeFilter === 'month') {
      const m = new Date(start)
      m.setMonth(m.getMonth() - 1)
      return { start: m, end }
    }

    if (rangeFilter === 'all') {
      return { start: new Date(0), end: new Date(9999, 0, 1) }
    }

    return { start, end }
  }, [rangeFilter])

  /* ---------------- FILTERED DATA ---------------- */

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false

      if (!b.date) return false

      if (selectedDate) {
        return b.date === selectedDate
      }

      const d = new Date(b.date)
      d.setHours(0, 0, 0, 0)

      return d >= rangeDates.start && d < rangeDates.end
    })
  }, [bookings, statusFilter, selectedDate, rangeDates])

  /* ---------------- STATS ---------------- */

  const todayStats = useMemo(() => {
    const today = bookings.filter(b => b.date === todayISO)
    return {
      total: today.length,
      pending: today.filter(b => b.status === 'pending').length,
      confirmed: today.filter(b => b.status === 'confirmed').length,
      completed: today.filter(b => b.status === 'completed').length,
      cancelled: today.filter(b => b.status === 'cancelled').length,
    }
  }, [bookings, todayISO])

  /* ---------------- ACTIONS ---------------- */

  const updateStatus = async (bookingId: string, status: Booking['status']) => {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status }),
    })
    fetchBookings()
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Bookings</h1>
            <p className="text-sm text-gray-600">Daily tracking and management</p>
          </div>
          <Link href="/" className="text-blue-600">← Back</Link>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(todayStats).map(([k, v]) => (
            <div key={k} className="bg-white border rounded-lg p-3 text-center">
              <p className="text-xs uppercase text-gray-500">{k}</p>
              <p className="text-xl font-bold">{v}</p>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="bg-white border rounded-lg p-4 space-y-4">

          {/* STATUS */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusFilter === s ? 'bg-black text-white' : 'bg-gray-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* RANGE */}
          <div className="flex gap-2 flex-wrap">
            {(['today', 'yesterday', 'week', 'month', 'all'] as const).map(r => (
              <button
                key={r}
                onClick={() => {
                  setRangeFilter(r)
                  setSelectedDate('')
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  rangeFilter === r && !selectedDate ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* DATE PICKER */}
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-sm text-red-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white border rounded-lg p-10 text-center text-gray-500">
            No bookings found for this selection
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(b => (
              <div key={b.id} className="bg-white border rounded-lg p-4 space-y-3">

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="font-semibold">{b.name || 'Customer'}</p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </div>

                  <div>
                    <p className="font-semibold">
                      {b.date} · {b.time}
                    </p>
                    <p className="text-xs">{b.service}</p>
                    <p className="text-xs text-gray-500">{b.barber}</p>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${b.status === 'pending' && 'bg-yellow-100 text-yellow-800'}
                      ${b.status === 'confirmed' && 'bg-green-100 text-green-800'}
                      ${b.status === 'completed' && 'bg-blue-100 text-blue-800'}
                      ${b.status === 'cancelled' && 'bg-red-100 text-red-800'}
                    `}>
                      {b.status}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 flex-wrap">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(b.bookingid, 'confirmed')} className="px-4 py-2 bg-black text-white rounded">
                        Confirm
                      </button>
                      <button onClick={() => updateStatus(b.bookingid, 'cancelled')} className="px-4 py-2 bg-black text-white rounded">
                        Cancel
                      </button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => updateStatus(b.bookingid, 'completed')} className="px-4 py-2 bg-black text-white rounded">
                      Complete
                    </button>
                  )}

                  <a
                    href={`https://wa.me/${b.phone.replace('+','')}`}
                    target="_blank"
                    className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"
                  >
                    <Image src="/Icons/whatsapp.png" alt="WhatsApp" width={18} height={18} />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
