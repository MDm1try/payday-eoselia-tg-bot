import { cleanEnv, str } from 'envalid'

process.env.TZ = 'Europe/Kyiv' // set default timezone

export function ValidateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    TELEGRAM_TOKEN: str(),
    TELEGRAM_BOT_USERNAME: str(),
    CRON_SECRET: str(),
  })
}
