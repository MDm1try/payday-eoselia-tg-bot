import type { IncomingMessage, ServerResponse } from 'http'
import { URL } from 'url'

import { CRON_SECRET } from '../config'
import type { ReminderTone } from '../types'

import { processDeleyedReminders, processReminders } from './processors'

const VALID_TONES: ReminderTone[] = ['friendly', 'reminder', 'warning', 'urgent']

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Verify Vercel Cron secret to prevent unauthorized calls
  const authHeader = req.headers['authorization']
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Unauthorized' }))
    return
  }

  const url = new URL(req.url!, `http://${req.headers.host}`)
  const tone = url.searchParams.get('tone')

  if (tone === 'delay') {
    const day = new Date().getDate()
    if (day > 20) {
      await processDeleyedReminders()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: true, tone }))
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ skipped: true, reason: 'Not after 20th' }))
    }
    return
  }

  if (tone && (VALID_TONES as string[]).includes(tone)) {
    await processReminders(tone as ReminderTone)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: true, tone }))
    return
  }

  res.writeHead(400, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Invalid or missing tone parameter' }))
}
