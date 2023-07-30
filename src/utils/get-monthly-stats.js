import { getCompanyTransactions } from '../firebase/helpers/company.helper'

export default async function getMonthlyStats ({ user }, transactionMonth) {
  let totalMontlyRevenue = 0
  let totalMontlyCost = 0
  let transactions = []

  if (user?.company?.id) {
    transactions = await getCompanyTransactions({
      companyId: user?.company?.id,
      month: transactionMonth,
      year: new Date().getFullYear()
    })
  }

  transactions.forEach((transaction) => {
    const { amount, type } = transaction

    if (type === 'revenue') {
      totalMontlyRevenue += amount
    } else {
      totalMontlyCost += amount
    }
  })

  return { totalMontlyRevenue, totalMontlyCost }
}
