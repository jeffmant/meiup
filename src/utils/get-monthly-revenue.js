import { getCompanyTransactions } from 'src/pages/api/transaction'

export default async function getMonthlyRevenue ({ user }, transactionMonth) {
  let total = 0

  async function getAllTransactions () {
    if (user?.company?.id) {
      const transactions = await getCompanyTransactions({
        companyId: user?.company?.id,
        month: transactionMonth
      })
      return transactions
    }
  }

  await getAllTransactions().then((transactions) => {
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
  })
  return total
}
