import { emoji } from '@grammyjs/emoji'
import type { CommandContext } from 'grammy'

import SessionChat from '../engine/SesssionChat'
import { createMortgageReminder } from '../notifications/sendMortgageReminder'

import type { ChatData, TelegramContext } from '@/types'

async function handleStart(ctx: CommandContext<TelegramContext>) {
  // stats
  ctx.session.starts++

  try {
    const user = await ctx.getAuthor()

    const chat: ChatData = {
      id: ctx.chat.id,
      userId: user.user.id,
      username: user.user.username,
      firstName: user.user.first_name,
      lastName: user.user.last_name,
      isBot: user.user.is_bot,
      addedToAttachmentMenu: user.user.added_to_attachment_menu,
      languageCode: user.user.language_code,
      startChat: new Date(),
      payments: [],
    }
    ctx.session.chats = [chat]
    // if (!ctx.session.chats.some((c) => c.id === chat.id)) {
    //   ctx.session.chats.push(chat)
    // }

    const currentChat = ctx.session.chats.find((c) => c.id === ctx.chat.id)!
    const displayName = currentChat.firstName || currentChat.username

    await ctx.reply(`Привіт, ${displayName}${emoji('red_heart')}`)

    const sessionChat = new SessionChat(ctx.chat.id, ctx.session.chats)
    const currentPayment = sessionChat.getTargetMonthPayment()

    if (currentPayment?.paid) {
      await ctx.reply(`Ваш платіж за цей місяць вже сплачено.`)
    } else if (currentPayment) {
      const { html, keyboard } = createMortgageReminder(ctx.chat.id, currentPayment)
      await ctx.reply(html, { parse_mode: 'HTML', reply_markup: keyboard })
    } else {
      const newPayment = sessionChat.createAndAddPaymentForTargetMonth()
      ctx.session.chats = sessionChat.getUpdatedChats()

      const { html, keyboard } = createMortgageReminder(ctx.chat.id, newPayment)
      await ctx.reply(html, { parse_mode: 'HTML', reply_markup: keyboard })
    }
  } catch (error) {
    await ctx.reply(ctx.emoji`Щось пішло не так, спробуйте ще раз ${'crying_face'}`)
    console.log('Error in handleStart:', error)
    // stats
    ctx.session.errors++
  }
}

export default handleStart
