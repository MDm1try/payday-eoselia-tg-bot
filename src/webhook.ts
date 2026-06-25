import './config'
import { webhookCallback } from 'grammy'

import { createBot } from './bot'

const bot = createBot()

export default webhookCallback(bot, 'http')
