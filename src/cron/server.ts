import cron from 'node-cron'

import { processDeleyedReminders, processReminders } from './processors'

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
    const today = new Date().getDate()
    if (today > 20) {
      // Only run after 20th of the month
      console.log('Running delayed reminders task')
      await processDeleyedReminders()
    }
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
