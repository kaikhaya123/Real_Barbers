import fs from 'fs'
import path from 'path'
import { sanitizePhone } from './whatsapp'

const DATA_DIR = path.join(process.cwd(), 'data')
const OUTGOING_FILE = path.join(DATA_DIR, 'outgoing.json')

function ensureOutgoingFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(OUTGOING_FILE)) fs.writeFileSync(OUTGOING_FILE, '[]')
}

function saveOutgoing(provider: string, to: string, body: string) {
  try {
    ensureOutgoingFile()
    const raw = fs.readFileSync(OUTGOING_FILE, 'utf8')
    const arr = JSON.parse(raw || '[]')
    arr.push({ provider, to: sanitizePhone(to), body, createdAt: new Date().toISOString() })
    fs.writeFileSync(OUTGOING_FILE, JSON.stringify(arr, null, 2))
  } catch (e) {
    // ignore write errors — best-effort logging for local testing
  }
}

export async function sendTwilioMessage(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM // e.g. whatsapp:+1415XXXXXXX
  if (!accountSid || !authToken || !from) {
    // Save outgoing message locally so developers can inspect replies during testing
    saveOutgoing('twilio-dry', to, body)
    return { ok: true, dry: true }
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const params = new URLSearchParams()
  params.append('From', from)
  params.append('To', `whatsapp:+${sanitizePhone(to)}`)
  params.append('Body', body)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Twilio error: ${res.status} ${txt}`)
  }

  const json = await res.json()
  // persist a copy of the outgoing message
  saveOutgoing('twilio', to, body)
  return json
}

export async function sendMetaMessage(to: string, body: string) {
  const token = process.env.WHATSAPP_META_TOKEN
  const phoneId = process.env.WHATSAPP_META_PHONE_NUMBER_ID
  if (!token || !phoneId) {
    saveOutgoing('meta-dry', to, body)
    return { ok: true, dry: true }
  }

  const url = `https://graph.facebook.com/v16.0/${phoneId}/messages`
  const payload = {
    messaging_product: 'whatsapp',
    to: sanitizePhone(to),
    text: { body },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Meta WhatsApp error: ${res.status} ${txt}`)
  }

  const json = await res.json()
  saveOutgoing('meta', to, body)
  return json
}

export default { sendTwilioMessage, sendMetaMessage }
