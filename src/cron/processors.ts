import SessionChat from '../engine/SesssionChat'
import { RedisAdapterWithKeys } from '../libs/RedisAdapterWithKeys'
import redisInstance from '../libs/redisInstance'
import { sendMortgageReminder } from '../notifications'
import type { ReminderTone, SessionData } from '../types'

export async function processReminders(tone: ReminderTone) {
  try {
    const storage = new RedisAdapterWithKeys<SessionData>(redisInstance)

    const keys = []
    for await (const key of storage.readAllKeys()) {
      keys.push(key)
    }

    for (const key of keys) {
      const session = await storage.read(key)

      if (session?.chats.length) {
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

export async function processDelayedReminders() {
  try {
    const storage = new RedisAdapterWithKeys<SessionData>(redisInstance)

    const keys = []
    for await (const key of storage.readAllKeys()) {
      keys.push(key)
    }

    for (const key of keys) {
      const session = await storage.read(key)

      if (session?.chats.length) {
        const chatId = Number(key)
        const sessionChat = new SessionChat(chatId, session.chats)
        const currentPayment = sessionChat.getTargetMonthPayment()

        if (currentPayment && !currentPayment.paid && currentPayment.delay) {
          await sendMortgageReminder(chatId, currentPayment, 'delay')
        }
      }
    }
  } catch (error) {
    console.log(`Error in delayed reminder task:`, error)
  }
}
