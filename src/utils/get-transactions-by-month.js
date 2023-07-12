import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { db } from 'src/firebase/config'

const getTransactionsByMonth = async () => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const q = query(
    collection(db, 'transactions'),
    where('createdAt', '>=', Timestamp.fromDate(new Date(currentYear, currentMonth - 1, 1))),
    where('createdAt', '<', Timestamp.fromDate(new Date(currentYear, currentMonth, 1)))
  )

  const querySnapshot = await getDocs(q)
  const transactions = querySnapshot.docs.map((doc) => doc.data())

  return transactions
}

export default getTransactionsByMonth
