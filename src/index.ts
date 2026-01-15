import '@/config'
import { ValidateEnv } from '@utils/validateEnv'

import { runTelegramBot } from './bot'

ValidateEnv()
runTelegramBot()
