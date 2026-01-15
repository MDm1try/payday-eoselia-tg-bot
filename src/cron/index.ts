import { freeStorage } from '@grammyjs/storage-free'
import cron from 'node-cron'

import { TELEGRAM_TOKEN } from '../config'
import SessionChat from '../engine/SesssionChat'
import { sendMortgageReminder } from '../notifications'
import type { ReminderTone, SessionData } from '../types'

async function processReminders(tone: ReminderTone) {
  try {
    const storage = freeStorage<SessionData>(TELEGRAM_TOKEN as string)
    const { keys } = (await storage.readAllKeys()) as any as { keys: string[] }

    for (const key of keys) {
      const session = await storage.read(key)

      if (session.chats.length) {
        const chatId = Number(key)
        const sessionChat = new SessionChat(chatId, session.chats)
        const currentPayment = sessionChat.getTargetMonthPayment()

        if (currentPayment && !currentPayment.paid) {
          await sendMortgageReminder(chatId, currentPayment, tone)
        } else if (!currentPayment) {
          const newPayment = sessionChat.createAndAddPaymentForTargetMonth()
          session.chats = sessionChat.getUpdatedChats()
          await storage.write(key, session)
          await sendMortgageReminder(chatId, newPayment, tone)
        }
      }
    }
  } catch (error) {
    console.log(`Error in reminder task (${tone}):`, error)
  }
}

async function processDeleyedReminders() {
  try {
    const storage = freeStorage<SessionData>(TELEGRAM_TOKEN as string)
    const { keys } = (await storage.readAllKeys()) as any as { keys: string[] }

    for (const key of keys) {
      const session = await storage.read(key)

      if (session.chats.length) {
        const chatId = Number(key)
        const sessionChat = new SessionChat(chatId, session.chats)
        const currentPayment = sessionChat.getTargetMonthPayment()

        if (currentPayment && !currentPayment.paid && currentPayment.delay) {
          await sendMortgageReminder(chatId, currentPayment, 'delay')
        }
      }
    }
  } catch (error) {
    console.log(`Error in deleyed reminder task:`, error)
  }
}

// Send friendly reminder on 10th of month at 11:00
const task10th = cron.schedule(
  '0 11 10 * *',
  async () => {
    console.log('Running 10th reminder (friendly tone)')
    await processReminders('friendly')
  },
  {
    timezone: 'Europe/Kyiv',
  }
)

// Send reminder on 15th of month at 11:00
const task15th = cron.schedule(
  '0 11 15 * *',
  async () => {
    console.log('Running 15th reminder (reminder tone)')
    await processReminders('reminder')
  },
  {
    timezone: 'Europe/Kyiv',
  }
)

// Send warning reminder on 20th of month at 11:00
const task20th = cron.schedule(
  '0 11 20 * *',
  async () => {
    console.log('Running 20th reminder (warning tone)')
    await processReminders('warning')
  },
  {
    timezone: 'Europe/Kyiv',
  }
)

// Send urgent reminder on 23rd of month at 11:00
const task23rd = cron.schedule(
  '0 11 23 * *',
  async () => {
    console.log('Running 23rd reminder (urgent tone)')
    await processReminders('urgent')
  },
  {
    timezone: 'Europe/Kyiv',
  }
)

const delayTask = cron.schedule(
  '0 12 * * *', // Every day at 12:00
  async () => {
    console.log('Running delayed reminders task')
    await processDeleyedReminders()
  },
  {
    timezone: 'Europe/Kyiv',
  }
)

export const startCron = () => {
  task10th.start()
  task15th.start()
  task20th.start()
  task23rd.start()
  delayTask.start()
  console.log('Cron jobs started: 10th, 15th, 20th, 23rd reminders')
}
