import { emoji } from '@grammyjs/emoji'
import type { CommandContext } from 'grammy'

import type { MortgagePayment, TelegramContext } from '../types'

function formatPaymentAsHTML(payment: MortgagePayment) {
  return `
Дата платежу: <b>${payment.id}</b>
Сума до сплати: <b>${payment.amount} грн</b>
Половина суми: <b>${payment.halfAmount} грн</b>
Статус: <b>${payment.paid ? `Сплачено ${emoji('check_mark_button')}` : `Не сплачено ${emoji('red_circle')}`}</b>
`
}

async function handleList(ctx: CommandContext<TelegramContext>) {
  try {
    const chatData = ctx.session.chats.find((c) => c.id === ctx.chat.id)
    if (chatData?.payments.length) {
      const html = chatData.payments.map((payment) => formatPaymentAsHTML(payment)).join('\n')
      await ctx.reply(html, { parse_mode: 'HTML' })
    } else {
      await ctx.reply('У вас немає запланованих платежів.')
    }
  } catch {
    await ctx.reply(ctx.emoji`Щось пішло не так, спробуйте ще раз ${'crying_face'}`)

    // stats
    ctx.session.errors++
  }
}

export default handleList
