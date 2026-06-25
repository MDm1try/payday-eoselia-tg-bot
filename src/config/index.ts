import path from 'path'

import dotenv from 'dotenv'

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}`),
})

export const { TELEGRAM_TOKEN, TELEGRAM_BOT_USERNAME, CRON_SECRET } = process.env
