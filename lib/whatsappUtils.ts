import { SERVICES } from './constants'
import { sanitizePhone } from './whatsapp'

function normalizeText(t?: string) {
  return (t || '').toString().replace(/\r/g, ' ').replace(/\n+/g, ' ').trim()
}

function levenshtein(a: string, b: string) {
  const an = a ? a.length : 0
  const bn = b ? b.length : 0
  if (an === 0) return bn
  if (bn === 0) return an
  const matrix: number[][] = Array.from({ length: an + 1 }, () => Array(bn + 1).fill(0))
  for (let i = 0; i <= an; i++) matrix[i][0] = i
  for (let j = 0; j <= bn; j++) matrix[0][j] = j
  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }
  return matrix[an][bn]
}

function similarity(a: string, b: string) {
  if (!a || !b) return 0
  const la = a.length
  const lb = b.length
  const dist = levenshtein(a.toLowerCase(), b.toLowerCase())
  const max = Math.max(la, lb)
  return 1 - dist / max
}

export function findBestServiceMatch(text?: string, threshold = 0.55) {
  if (!text) return null
  const t = text.toLowerCase()
  let best: { score: number; service: any | null } = { score: 0, service: null }
  for (const s of SERVICES) {
    const name = s.name.toLowerCase()
    if (name === t) return s
    if (name.includes(t) || t.includes(name)) return s
    const score = similarity(name, t)
    if (score > best.score) best = { score, service: s }
  }
  return best.score >= threshold ? best.service : null
}

export function findServiceByText(text?: string) {
  if (!text) return null
  // try direct id/name matches first
  const t = text.toLowerCase().trim()
  for (const s of SERVICES) {
    if (s.name.toLowerCase() === t) return s
    if (s.id.toLowerCase() === t) return s
  }
  // try contains
  for (const s of SERVICES) {
    if (t.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(t)) return s
  }
  // fallback to fuzzy match
  return findBestServiceMatch(text)
}

export function parseBookingFields(rawText?: string) {
  const text = normalizeText(rawText)
  const serviceMatch = text.match(/Service[:\\-]\s*([^;\\n]+)/i)
  const nameMatch = text.match(/Name[:\\-]\s*([^;\\n]+)/i)
  const dateMatch = text.match(/(Date|When|Time)[:\\-]\s*([^;\\n]+)/i)
  const barberMatch = text.match(/Barber[:\\-]\s*([^;\\n]+)/i)

  let service = serviceMatch ? serviceMatch[1].trim() : undefined
  const name = nameMatch ? nameMatch[1].trim() : undefined
  const dateTime = dateMatch ? dateMatch[2].trim() : undefined
  const barber = barberMatch ? barberMatch[1].trim() : undefined

  // If service not explicitly provided, try to detect any known service name in text
  if (!service) {
    for (const s of SERVICES) {
      if (text.toLowerCase().includes(s.name.toLowerCase())) {
        service = s.name
        break
      }
    }
  }

  return { service, name, dateTime, barber, raw: rawText }
}

export function normalizePhoneForStorage(raw?: string) {
  if (!raw) return ''
  return sanitizePhone(raw)
}

export default { findServiceByText, parseBookingFields, normalizePhoneForStorage, findBestServiceMatch }
