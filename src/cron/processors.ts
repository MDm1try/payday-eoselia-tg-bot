import { freeStorage } from '@grammyjs/storage-free'

import { TELEGRAM_TOKEN } from '../config'
import SessionChat from '../engine/SesssionChat'
import { sendMortgageReminder } from '../notifications'
import type { ReminderTone, SessionData } from '../types'

export async function processReminders(tone: ReminderTone) {
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

export async function processDeleyedReminders() {
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
