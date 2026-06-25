import { emoji } from '@grammyjs/emoji'
import { InlineKeyboard } from 'grammy'

import CallbackQueryHandler from '../helpers/CallbackQueryHandler'
import botApi from '../libs/botApi'
import type { MortgagePayment, ReminderTone } from '../types'

function formatBalance(amount: number): string {
  return amount.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatMortgageReminderAsHTML(payment: MortgagePayment, tone: ReminderTone = 'friendly') {
  const toneMessages = {
    friendly: `${emoji('calendar')} <b>Нагадування про платіж</b>\n\nГотуй гроші:`,
    reminder: `${emoji('bell')} <b>Нагадування</b>\n\nПлатіж наближається:`,
    warning: `${emoji('warning')} <b>Важливо!</b>\n\nДо кінцевого терміну оплати залишилось мало часу:`,
    urgent: `${emoji('red_exclamation_mark')} <b>ТЕРМІНОВЕ НАГАДУВАННЯ!</b>\n\nПлатіж потрібно здійснити найближчим часом:`,
    delay: `${emoji('alarm_clock')} <b>Нагадування</b>\n\nЦе ваше відкладене нагадування про платіж:`,
  }

  return `
${toneMessages[tone]}

Дата платежу: <b>${payment.id}</b>
Сума до сплати: <b>${formatBalance(payment.amount)} грн</b>
Половина суми: <b>${formatBalance(payment.halfAmount)} грн</b>
Залишок по кредиту після платежу: <b>${formatBalance(payment.remainingBalance)} грн</b>
`
}

export function createMortgageReminder(
  chatId: number,
  payment: MortgagePayment,
  tone: ReminderTone = 'friendly'
) {
  const html = formatMortgageReminderAsHTML(payment, tone)

  const keyboard = new InlineKeyboard()

  keyboard.text(
    `${emoji('check_mark_button')} Підтвердити оплату`,
    CallbackQueryHandler.encodePaid(chatId, payment.id)
  )
  keyboard.text(
    `${emoji('alarm_clock')} Нагадати пізніше`,
    CallbackQueryHandler.encodeDelay(chatId, payment.id)
  )

  return { html, keyboard }
}

async function sendMortgageReminder(
  chatId: number,
  payment: MortgagePayment,
  tone: ReminderTone = 'friendly'
) {
  const { html, keyboard } = createMortgageReminder(chatId, payment, tone)

  return botApi.sendMessage(chatId, html, {
    parse_mode: 'HTML',
    reply_markup: keyboard,
  })
}

export default sendMortgageReminder
