import path from 'path'

import dotenv from 'dotenv'

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}`),
})

export const { TELEGRAM_TOKEN, TELEGRAM_BOT_USERNAME, CRON_SECRET } = process.env

export const {
  KV_REST_API_READ_ONLY_TOKEN,
  KV_REST_API_TOKEN,
  KV_REST_API_URL,
  KV_URL,
  REDIS_URL,
} = process.env
