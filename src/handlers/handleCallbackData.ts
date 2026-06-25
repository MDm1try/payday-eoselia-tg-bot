import { emoji } from '@grammyjs/emoji'

import CallbackQueryHandler from '../helpers/CallbackQueryHandler'
import { unknownCommand } from '../helpers/replayTips'
import { InlineKeyboardPrefixEnum, type TelegramContext } from '../types'

async function handleCallbackData(ctx: TelegramContext) {
  const data = ctx.callbackQuery?.data ?? ''

  const [prefix] = data.split(CallbackQueryHandler.delimiter)

  switch (prefix) {
    case InlineKeyboardPrefixEnum.DELAY: {
      const decoded = CallbackQueryHandler.decodeDelay(data)
      if (!decoded) {
        await ctx.reply(...unknownCommand)
        break
      }

      const delayClickCount = ctx.session.chats
        .find((chat) => chat.id === decoded.chatId)
        ?.payments.find((p) => p.id === decoded.paymentId)?.delay

      if (delayClickCount && delayClickCount >= 1) {
        const messages = [
          emoji('broken_heart'),
          emoji('smiling_face_with_tear'),
          `Ти вже відкладав цей платіж! Не треба так часто ${emoji('slightly_smiling_face')}`,
          `Стоп-стоп, я вже записав, що ти хочеш нагадати пізніше! Навіщо ще раз? ${emoji('thinking_face')}`,
          `Окей, я розумію - ти дуже зайнятий ${emoji('grinning_face_with_sweat')}`,
          `${emoji('shushing_face')}`,
        ]

        const message = messages[Math.floor(Math.random() * messages.length)]
        await ctx.reply(message)
      } else {
        ctx.session.chats = ctx.session.chats.map((chat) => {
          if (chat.id === decoded.chatId) {
            return {
              ...chat,
              payments: chat.payments.map((p) =>
                p.id === decoded.paymentId ? { ...p, delay: p.delay + 1 } : p
              ),
            }
          }
          return chat
        })
        await ctx.reply(`Добре, нагадаю пізніше!`)
      }
      break
    }
    case InlineKeyboardPrefixEnum.PAID: {
      const decoded = CallbackQueryHandler.decodePaid(data)
      if (!decoded) {
        await ctx.reply(...unknownCommand)
        break
      }
      const paidClickCount = ctx.session.chats
        .find((chat) => chat.id === decoded.chatId)
        ?.payments.find((p) => p.id === decoded.paymentId)?.paid

      if (paidClickCount && paidClickCount >= 1) {
        const messages = [
          emoji('red_heart'),
          `Ти вже натискав на цю кнопку! Не треба так багато разів ${emoji('slightly_smiling_face')}`,
          `Стоп-стоп, я вже записав, що ти заплатив! Навіщо ще раз? ${emoji('thinking_face')}`,
          `Окей, я розумію - ти дуже пишаєшся цим платежем ${emoji('grinning_face_with_sweat')}`,
          `${emoji('angry_face')}`,
          `Ти хочеш заплатити двічі? Банк буде радий, але не треба ${emoji('upside_down_face')}`,
          `Я не забув, обіцяю! Платіж вже в базі ${emoji('thumbs_up')} `,
          emoji(`money_with_wings`),
        ]

        const message = messages[Math.floor(Math.random() * messages.length)]
        await ctx.reply(message)
      } else {
        ctx.session.chats = ctx.session.chats.map((chat) => {
          if (chat.id === decoded.chatId) {
            return {
              ...chat,
              payments: chat.payments.map((p) =>
                p.id === decoded.paymentId ? { ...p, paid: p.paid + 1 } : p
              ),
            }
          }
          return chat
        })

        await ctx.reply(`Дякуємо за ваш внесок!`)
      }
      break
    }
    default:
      await ctx.reply(...unknownCommand)
      break
  }

  await ctx.answerCallbackQuery() // remove loading animation

  // stats
  ctx.session.callbackQueries++
}

export default handleCallbackData
