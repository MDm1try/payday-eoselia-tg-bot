import './config'
import { run } from '@grammyjs/runner'

import { createBot } from './bot'
import { startCron } from './cron/server'
import { ValidateEnv } from './utils/validateEnv'

async function main() {
  ValidateEnv()

  const bot = createBot()

  await bot.api.setMyCommands([
    { command: 'list', description: 'Платежі' },
    { command: 'status', description: 'Поточний платіж' },
  ])

  await bot.init()
  run(bot, { runner: { fetch: { allowed_updates: ['message', 'callback_query'] } } })
  startCron()

  console.log(`Bot ${bot.botInfo.username} is up and running`)
}

main()
