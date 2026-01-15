import { differenceInDays, differenceInMonths } from 'date-fns'

class Mortgage {
  private principal = 2709000 // Loan amount

  private annualInterestRateFirst10Years = 0.07 // Annual interest rate first 10 years, 19.11.2025 to 18.11.2035
  private annualInterestRateAfter10Years = 0.1 // Annual interest rate after 10 years, 19.11.2035 to 17.11.2045
  private collateralInsurance = 8708.5
  private fixedPrincipalPayment = 11288

  private loanStartDate = new Date(2025, 10, 19) // Loan start date: November 19, 2025
  private firstPaymentDate = new Date(2025, 11, 25) // Start date of the mortgage (loan disbursement date)
  public paymentDay = 25 // Payment day of the month

  private getDaysBetween(paymentDate: Date): number {
    const prevMonth = new Date(
      paymentDate.getFullYear(),
      paymentDate.getMonth() - 1,
      this.paymentDay
    )
    return differenceInDays(paymentDate, prevMonth)
  }

  private getCountPayments(paymentDate: Date): number {
    const count = differenceInMonths(paymentDate, this.firstPaymentDate)
    return count
  }

  public getRemainingBalance(paymentDate: Date): number {
    // If before or at first payment, balance is still the principal
    if (paymentDate <= this.firstPaymentDate) {
      return this.principal
    }

    const countPayments = this.getCountPayments(paymentDate)
    // Each payment reduces balance by fixed principal amount
    // Return balance BEFORE this payment (subtract previous payments only)
    return Number((this.principal - countPayments * this.fixedPrincipalPayment).toFixed(2))
  }

  private getDailyInterestRate(paymentDate: Date): number {
    const tenYearMark = new Date('2035-11-18')
    const interestRates =
      paymentDate <= tenYearMark
        ? this.annualInterestRateFirst10Years / 365
        : this.annualInterestRateAfter10Years / 365

    return Number(interestRates.toFixed(10))
  }

  private getMonthlyFixedCommission(paymentDate: Date): number {
    const tenYearMark = new Date('2035-11-18')
    return paymentDate <= tenYearMark ? 55 : 75
  }

  public getInterestPayment(paymentDate: Date): number {
    // For the first payment (December 2025), calculate interest for partial period (Nov 19 to Nov 30)
    if (paymentDate.getTime() === this.firstPaymentDate.getTime()) {
      const daysInPeriod = differenceInDays(new Date(2025, 10, 30), this.loanStartDate) + 1
      const dailyInterestRate = this.getDailyInterestRate(paymentDate)
      const remainingBalance = this.getRemainingBalance(paymentDate)

      return Number((remainingBalance * dailyInterestRate * daysInPeriod).toFixed(2))
    }

    const remainingBalance = this.getRemainingBalance(paymentDate)
    const dailyInterestRate = this.getDailyInterestRate(paymentDate)
    const daysInPeriod = this.getDaysBetween(paymentDate)
    const comission = this.getMonthlyFixedCommission(paymentDate)

    const interestPayment = remainingBalance * dailyInterestRate * daysInPeriod + comission

    return Number(interestPayment.toFixed(2))
  }

  public getMonthlyPayment(paymentDate: Date): number {
    const interestPayment = this.getInterestPayment(paymentDate)
    if (paymentDate.getMonth() === 10) {
      return interestPayment + this.fixedPrincipalPayment + this.collateralInsurance
    }
    return interestPayment + this.fixedPrincipalPayment
  }

  public getPaymentDate(month: number, year: number) {
    const paymentDate = new Date(year, month - 1, this.paymentDay)
    return paymentDate
  }
}

export default Mortgage
