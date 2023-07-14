import firebaseApp from '../../firebase/config'
import { getFirestore, getDocs, where, query, collection, Timestamp } from 'firebase/firestore'

const db = getFirestore(firebaseApp)
const transactionsRef = collection(db, 'transactions')

export const getCompanyTransactions = async ({ companyId, type, month, page = 1, limit = 5 }) => {
  const year = new Date().getFullYear() // Obtém o ano atual
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 1)

  try {
    const q = query(
      transactionsRef,
      where('companyId', '==', companyId),
      where('type', '==', type),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<', Timestamp.fromDate(endDate))
    )

    const querySnapshot = await getDocs(q)

    const transactions = []
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() })
    })
    return transactions
  } catch (error) {
    console.log(error)
    return error
  }
}
