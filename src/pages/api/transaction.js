import firebaseApp from '../../firebase/config'
import { getFirestore, getDocs, where, query, collection } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

const transactionsRef = collection(db, 'transactions')

export const getCompanyTransactions = async ({ companyId, type, page = 1, limit = 5 }) => {
  try {
    const q = query(
      transactionsRef,
      where('companyId', '==', companyId),
      where('type', '==', type)
    )

    const querySnapshot = await getDocs(q)

    const transactions = []
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() })
    })
    return transactions
  } catch (error) {
    return error
  }
}
