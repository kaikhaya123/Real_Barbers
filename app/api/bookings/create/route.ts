import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createBooking, isSlotAvailable } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, service, date, time, barber } = body
    if (!name || !service || !date || !time || !barber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check availability
    const available = isSlotAvailable(barber, date, time)
    if (!available) {
      return NextResponse.json({ error: 'Slot not available' }, { status: 409 })
    }

    const id = 'RB-' + uuidv4().slice(0, 8)
    const booking = createBooking({ id, name, service, date, time, barber })
    return NextResponse.json({ booking }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
