import { getCompanyTransactions } from '../firebase/helpers/company.helper'

export default async function getMonthlyRevenue ({ user }, transactionMonth) {
  let total = 0
  let transactions = []

  if (user?.company?.id) {
    transactions = await getCompanyTransactions({
      companyId: user?.company?.id,
      month: transactionMonth,
      year: new Date().getFullYear()
    })
  }

  console.log('Total antes:', total)

  transactions.forEach((transaction) => {
    const { amount, type } = transaction
    const numericAmount = Number(
      amount
        .replace(/[^0-9.,]+/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    )

    if (type === 'revenue') {
      total += numericAmount
    } else {
      total -= numericAmount
    }
    console.log(total)
  })

  return total
}
