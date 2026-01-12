/**
 * Meta WhatsApp Webhook - DISABLED
 * 
 * This endpoint was used for automated Meta WhatsApp bookings.
 * Since we're using manual staff replies instead, this is disabled.
 * 
 * To re-enable: Restore from git history if needed
 */

export async function POST(req: Request) {
  // Disabled - using web form only with manual WhatsApp replies from staff
  console.log('[Meta WhatsApp] Webhook disabled - using web form + manual replies')
  return new Response('OK', { status: 200 })
}
