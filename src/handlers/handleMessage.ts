import { unknownCommand } from '../helpers/replayTips'
import type { TelegramContext } from '../types'

function handleMessage(ctx: TelegramContext) {
  ctx.reply(...unknownCommand)

  // stats
  ctx.session.messages++
}

export default handleMessage
