import type { CommandContext } from 'grammy'

import type { TelegramContext } from '../types'

async function handleStop(ctx: CommandContext<TelegramContext>) {
  try {
    const user = await ctx.getAuthor()
    ctx.session.chats = ctx.session.chats.filter((chat) => chat.id !== ctx.chat.id)
    await ctx.reply(ctx.emoji`broken_heart`)
    await ctx.reply(
      ctx.emoji`Прощавайте, ${user.user.first_name}${'crying_face'}\nЯкщо захочете знову отримувати нагадування, просто надішліть команду /start`
    )
  } catch (error) {
    await ctx.reply(ctx.emoji`Щось пішло не так, спробуйте ще раз ${'crying_face'}`)
    console.log('Error in handleStop:', error)
    // stats
    ctx.session.errors++
  }
}

export default handleStop
