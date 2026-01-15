import { emoji } from '@grammyjs/emoji'
import type { CommandContext } from 'grammy'

import SessionChat from '../engine/SesssionChat'
import type { TelegramContext } from '../types'

async function handleStatus(ctx: CommandContext<TelegramContext>) {
  try {
    const sessionChat = new SessionChat(ctx.chat.id, ctx.session.chats)
    const currentPayment = sessionChat.getTargetMonthPayment()

    if (currentPayment) {
      await ctx.reply(`Ваш платіж за цей місяць:

Дата платежу: ${currentPayment.id}
Сума до сплати: ${currentPayment.amount} грн
Половина суми: ${currentPayment.halfAmount} грн
Статус: ${currentPayment.paid ? `Сплачено ${emoji('check_mark_button')}` : `Не сплачено ${emoji('red_circle')}`}`)
    } else {
      await ctx.reply('У вас немає запланованих платежів на цей місяць.')
    }
  } catch {
    await ctx.reply(ctx.emoji`Щось пішло не так, спробуйте ще раз ${'crying_face'}`)

    // stats
    ctx.session.errors++
  }
}

export default handleStatus
