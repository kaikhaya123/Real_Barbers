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
  note?: string | null
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<'all' | Booking['status']>('pending')
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('today')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [notification, setNotification] = useState('')

  const notify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

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

  /* ---------- DATE FILTER ---------- */

  const dateRange = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    const end = new Date(t)
    end.setDate(end.getDate() + 1)

    const map: any = {
      today: [t, end],
      yesterday: [new Date(t.getTime() - 86400000), t],
      week: [new Date(t.getTime() - 604800000), end],
      month: [new Date(t.setMonth(t.getMonth() - 1)), end],
      all: [new Date(0), new Date(9999, 0, 1)],
    }

    return map[dateFilter]
  }, [dateFilter])

  const filtered = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false
    if (b.date) {
      const d = new Date(b.date)
      d.setHours(0, 0, 0, 0)
      return d >= dateRange[0] && d < dateRange[1]
    }
    return true
  })

  /* ---------- STATS ---------- */

  const stats = useMemo(() => {
    const today = bookings.filter(b => b.date === new Date().toISOString().split('T')[0])
    return {
      total: today.length,
      pending: today.filter(b => b.status === 'pending').length,
      confirmed: today.filter(b => b.status === 'confirmed').length,
      completed: today.filter(b => b.status === 'completed').length,
      cancelled: today.filter(b => b.status === 'cancelled').length,
    }
  }, [bookings])

  /* ---------- BARBER LOAD ---------- */

  const barberLoad = useMemo(() => {
    const map: Record<string, number> = {}
    bookings.forEach(b => {
      if (!b.barber || b.status === 'cancelled') return
      map[b.barber] = (map[b.barber] || 0) + 1
    })
    return map
  }, [bookings])

  /* ---------- TIME SLOT LOAD ---------- */

  const timeLoad = useMemo(() => {
    const map: Record<string, number> = {}
    bookings.forEach(b => {
      if (!b.time || b.status === 'cancelled') return
      map[b.time] = (map[b.time] || 0) + 1
    })
    return map
  }, [bookings])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const updateStatus = async (bookingId: string, status: Booking['status']) => {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status }),
    })
    notify(`Booking marked as ${status}`)
    fetchBookings()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Bookings</h1>
            <p className="text-sm text-gray-600">Today overview and live queue</p>
          </div>
          <Link href="/" className="text-blue-600">← Back</Link>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="bg-white border rounded-lg p-3 text-center">
              <p className="text-xs uppercase text-gray-500">{k}</p>
              <p className="text-xl font-bold">{v}</p>
            </div>
          ))}
        </div>

        {/* BARBER LOAD */}
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">Barber Load</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(barberLoad).map(([b, c]) => (
              <span key={b} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {b} {c}
              </span>
            ))}
          </div>
        </div>

        {/* NOTIFICATION */}
        {notification && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-3 text-sm">
            {notification}
          </div>
        )}

        {/* BOOKINGS */}
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white border rounded-lg p-10 text-center text-gray-500">
            No bookings yet. Walk-ins will appear here once added.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(b => (
              <div key={b.id} className="bg-white border rounded-lg p-4 space-y-3">

                {/* QUEUE */}
                {b.queuenumber && (
                  <div className="text-sm text-green-700 font-bold">
                    Queue #{b.queuenumber} · Used on arrival
                  </div>
                )}

                {/* MAIN */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="font-semibold">{b.name || 'Walk-in'}</p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </div>

                  <div>
                    <p className="font-semibold">{b.time || 'No time'} · {b.date}</p>
                    {timeLoad[b.time || ''] > 3 && (
                      <p className="text-xs text-red-600">Overbooked slot</p>
                    )}
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
                      <button onClick={() => updateStatus(b.bookingid, 'confirmed')} className="btn-green">Confirm</button>
                      <button onClick={() => updateStatus(b.bookingid, 'cancelled')} className="btn-red">Cancel</button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => updateStatus(b.bookingid, 'completed')} className="btn-blue">Complete</button>
                  )}
                  <a
                    href={`https://wa.me/${b.phone.replace('+','')}?text=${encodeURIComponent(
                      `Hi ${b.name || ''}, your booking at ${b.time} is confirmed.`
                    )}`}
                    target="_blank"
                    className="btn-whatsapp"
                  >
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
