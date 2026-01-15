import { emojiParser } from '@grammyjs/emoji'
import { run } from '@grammyjs/runner'
import { freeStorage } from '@grammyjs/storage-free'
import { Bot, session } from 'grammy'
import type { StorageAdapter } from 'grammy'

import { handleStart, handleList, handleStatus } from './commands'
import { TELEGRAM_TOKEN } from './config'
import { startCron } from './cron'
import { handleMessage, handleCallbackData } from './handlers'
import { unknownError } from './helpers/replayTips'
import type { SessionData, TelegramContext } from './types'

export async function runTelegramBot() {
  console.log('🤖 Starting bot...')
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

  // Callbacks
  bot.on('callback_query:data', handleCallbackData)
  bot.on('message', handleMessage)

  // Errors
  bot.catch((botError) => {
    // stats
    botError.ctx.session.longPollingErrors++
    botError.ctx.reply(...unknownError())
    console.error('Bot error:', botError.error)
  })

  await bot.api.setMyCommands([
    { command: 'list', description: 'Платежі' },
    { command: 'status', description: 'Поточний платіж' },
  ])

  // Start bot
  await bot.init()

  run(bot, {
    runner: { fetch: { allowed_updates: ['message', 'callback_query'] } },
  })

  // run cron tasks
  startCron()

  console.log(`Bot ${bot.botInfo.username} is up and running`)
}
