import { loadBookings, updateBookingStatus } from '@/lib/bookings'

export async function GET() {
  try {
    const bookings = await loadBookings()
    return Response.json(bookings)
  } catch (err) {
    console.error('Error loading bookings:', err)
    return Response.json({ error: 'Failed to load bookings' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { bookingId, status } = await req.json()

    if (!bookingId || !status) {
      return Response.json({ error: 'Missing bookingId or status' }, { status: 400 })
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await updateBookingStatus(bookingId, status as any)

    if (!updated) {
      return Response.json({ error: 'Booking not found' }, { status: 404 })
    }

    return Response.json({ success: true, booking: updated })
  } catch (err) {
    console.error('Error updating booking:', err)
    return Response.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
