import type { EmojiFlavor } from '@grammyjs/emoji'
import { emojiParser } from '@grammyjs/emoji'
import { apiThrottler } from '@grammyjs/transformer-throttler'
import { Bot } from 'grammy'
import type { Context } from 'grammy'

import { TELEGRAM_TOKEN } from '@/config'

const bot = new Bot<EmojiFlavor<Context>>(TELEGRAM_TOKEN as string)

bot.use(emojiParser())

bot.api.config.use(apiThrottler())

// Errors
bot.catch((botError) => {
  console.error(botError)
})

export default bot.api
