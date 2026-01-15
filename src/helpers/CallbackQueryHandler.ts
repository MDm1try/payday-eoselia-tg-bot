import { InlineKeyboardPrefixEnum } from '../types'

class CallbackQueryHandler {
  static delimiter = '_'

  static encodePaid(chatId: number, paymentId: string): string {
    return [InlineKeyboardPrefixEnum.PAID, chatId, paymentId].join(CallbackQueryHandler.delimiter)
  }

  static decodePaid(data: string): { chatId: number; paymentId: string } | null {
    const [, chatId, paymentId] = data.split(CallbackQueryHandler.delimiter)
    return { chatId: Number(chatId), paymentId }
  }

  static encodeDelay(chatId: number, paymentId: string): string {
    return [InlineKeyboardPrefixEnum.DELAY, chatId, paymentId].join(CallbackQueryHandler.delimiter)
  }

  static decodeDelay(data: string): { chatId: number; paymentId: string } | null {
    const [, chatId, paymentId] = data.split(CallbackQueryHandler.delimiter)
    return { chatId: Number(chatId), paymentId }
  }
}

export default CallbackQueryHandler
