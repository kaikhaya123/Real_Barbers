import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // For now we just log events server-side. You can extend this to save to a DB.
    // eslint-disable-next-line no-console
    console.log('Analytics event received:', JSON.stringify(body))
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
