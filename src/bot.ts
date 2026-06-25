import { emojiParser } from '@grammyjs/emoji'
import { freeStorage } from '@grammyjs/storage-free'
import { Bot, session } from 'grammy'
import type { StorageAdapter } from 'grammy'

import { handleStart, handleList, handleStatus, handleStop } from './commands'
import { TELEGRAM_TOKEN } from './config'
import { handleMessage, handleCallbackData } from './handlers'
import { unknownError } from './helpers/replayTips'
import type { SessionData, TelegramContext } from './types'

export function createBot() {
  const bot = new Bot<TelegramContext>(TELEGRAM_TOKEN as string)

  const storage = freeStorage<SessionData>(bot.token) as any as StorageAdapter<SessionData>

  bot.use(
    session<SessionData, TelegramContext>({
      initial: () => ({
        starts: 0,
        messages: 0,
        myChatMembers: 0,
        callbackQueries: 0,
        errors: 0,
        longPollingErrors: 0,
        timestamp: new Date(),
        chats: [],
      }),
      storage,
    })
  )

  bot.use(emojiParser())

  bot.command('start', handleStart)
  bot.command('list', handleList)
  bot.command('status', handleStatus)
  bot.command('stop', handleStop)

  // Callbacks
  bot.on('callback_query:data', handleCallbackData)
  bot.on('message', handleMessage)

  // Errors
  bot.catch((botError) => {
    botError.ctx.session.longPollingErrors++
    botError.ctx.reply(...unknownError())
    console.error('Bot error:', botError.error)
  })

  return bot
}
