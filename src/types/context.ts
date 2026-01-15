import type { EmojiFlavor } from '@grammyjs/emoji'
import type { Context, SessionFlavor } from 'grammy'

export type MortgagePayment = {
  id: string // Date in fromat dd-mm-yyyy
  paidDate: Date
  amount: number
  halfAmount: number
  remainingBalance: number
  paid: number
  delay: number
}

export type ChatData = {
  id: number
  userId: number
  username?: string
  firstName?: string
  lastName?: string
  isBot: boolean
  addedToAttachmentMenu?: boolean
  languageCode?: string
  startChat: Date
  payments: MortgagePayment[]
}

export type SessionData = {
  // commands
  starts: number
  // others
  myChatMembers: number
  messages: number
  callbackQueries: number
  longPollingErrors: number
  errors: number
  timestamp: Date
  chats: ChatData[]
}

export type TelegramContext = Context & EmojiFlavor & SessionFlavor<SessionData>
