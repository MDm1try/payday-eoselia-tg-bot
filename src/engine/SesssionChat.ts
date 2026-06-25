import { formatDate } from 'date-fns'

import type { ChatData, MortgagePayment } from '../types'

import Mortgage from './Mortgage'

class SessionChat {
  private chats: ChatData[]
  private chatId: number
  private mortgage = new Mortgage()

  constructor(chatId: number, chats: ChatData[]) {
    this.chatId = chatId
    this.chats = chats.map((chat) => ({ ...chat, payments: [...chat.payments] })) // Deep copy payments array
  }

  private get currentChat(): ChatData | undefined {
    return this.chats.find((c) => c.id === this.chatId)
  }

  private get payments(): MortgagePayment[] {
    return this.currentChat?.payments || []
  }

  /**
   * Get the target payment date based on current date and payment day.
   * If today is before the 25th, target current month.
   * If today is on or after the 25th, target next month.
   */
  private getTargetPaymentDate(): Date {
    const today = new Date()
    const currentDay = today.getDate()
    const paymentDay = this.mortgage.paymentDay

    // If we're at or past the payment day, target next month
    if (currentDay >= paymentDay) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, paymentDay)
      return this.mortgage.getPaymentDate(nextMonth.getMonth() + 1, nextMonth.getFullYear())
    }

    // Otherwise, target current month
    return this.mortgage.getPaymentDate(today.getMonth() + 1, today.getFullYear())
  }

  private getTargetPaymentId(): string {
    const targetDate = this.getTargetPaymentDate()
    return formatDate(targetDate, 'dd-MM-yyyy')
  }

  public getTargetMonthPayment(): MortgagePayment | undefined {
    const paymentId = this.getTargetPaymentId()
    return this.payments.find((p) => p.id === paymentId)
  }

  public createPaymentForTargetMonth(): MortgagePayment {
    const paidDate = this.getTargetPaymentDate()
    const id = formatDate(paidDate, 'dd-MM-yyyy')
    const amount = this.mortgage.getMonthlyPayment(paidDate)
    const remainingBalance = this.mortgage.getRemainingBalance(paidDate)

    const payment: MortgagePayment = {
      id,
      paidDate: paidDate,
      amount: amount,
      remainingBalance,
      halfAmount: Math.ceil(amount / 2),
      paid: 0,
      delay: 0,
    }

    return payment
  }

  public addPayment(payment: MortgagePayment): void {
    const chat = this.currentChat
    if (chat) {
      chat.payments.push(payment)
    }
  }

  public createAndAddPaymentForTargetMonth(): MortgagePayment {
    const existingPayment = this.getTargetMonthPayment()
    if (existingPayment) {
      return existingPayment
    }

    const payment = this.createPaymentForTargetMonth()
    this.addPayment(payment)
    return payment
  }

  public getUpdatedChats(): ChatData[] {
    return this.chats
  }
}

export default SessionChat
