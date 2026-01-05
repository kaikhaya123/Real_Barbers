import { NextRequest, NextResponse } from 'next/server'
import { isSlotAvailable } from '@/lib/db'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const barber = url.searchParams.get('barber') || ''
  const date = url.searchParams.get('date') || ''
  const time = url.searchParams.get('time') || ''
  if (!barber || !date || !time) {
    return NextResponse.json({ error: 'Missing query params' }, { status: 400 })
  }
  const available = isSlotAvailable(barber, date, time)
  return NextResponse.json({ available })
}
