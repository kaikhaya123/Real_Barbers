// Lightweight analytics helper (client-side). Attempts to use gtag/dataLayer, falls back to sending to /api/track.
export async function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return

  try {
    if ((window as any).gtag && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', name, params || {})
      return
    }

    if ((window as any).dataLayer && Array.isArray((window as any).dataLayer)) {
      ;(window as any).dataLayer.push({ event: name, ...params })
      return
    }

    // Fallback: try to send to a simple tracking endpoint
    if (navigator.sendBeacon) {
      const payload = JSON.stringify({ event: name, ...params, ts: Date.now() })
      navigator.sendBeacon('/api/track', payload)
      return
    }

    // Last resort: dispatch a custom event so other listeners can capture it
    window.dispatchEvent(new CustomEvent('app_event', { detail: { event: name, ...params } }))
  } catch (e) {
    // swallow errors to avoid breaking UX
    // eslint-disable-next-line no-console
    console.warn('trackEvent failed', e)
  }
}
