import { collection, query, getDocs, where } from 'firebase/firestore'
import { firestoreDB } from 'src/firebase/config'

const transactionsRef = collection(firestoreDB, 'transactions')
const querySnapshot = await getDocs(transactionsRef)

export const calculateTotalRevenue = async () => {
  let totalRevenue = 0

  querySnapshot.forEach((doc) => {
    const transaction = doc.data()
    const amount = parseFloat(transaction.amount.replace(',', '.'))
    totalRevenue += transaction.type === 'revenue' ? amount : -amount
  })

  return totalRevenue
}

export const calculateAnnualRevenue = async (selectedYear) => {
  const q = query(
    transactionsRef,
    where('createdAt', '>=', new Date(selectedYear, 0, 1)),
    where('createdAt', '<', new Date(selectedYear + 1, 0, 1))
  )
  const querySnapshot = await getDocs(q)

  let annualRevenue = 0

  querySnapshot.forEach((doc) => {
    const transaction = doc.data()
    const amount = parseFloat(transaction.amount.replace(',', '.'))
    annualRevenue += transaction.type === 'revenue' ? amount : -amount
  })

  return annualRevenue
}

export const calculateMonthlyRevenue = async (selectedMonth, selectedYear) => {
  const q = query(
    transactionsRef,
    where('createdAt', '>=', new Date(selectedYear, selectedMonth, 1)),
    where('createdAt', '<', new Date(selectedYear, selectedMonth + 1, 1))
  )
  const querySnapshot = await getDocs(q)

  let monthlyRevenue = 0

  querySnapshot.forEach((doc) => {
    const transaction = doc.data()
    const amount = parseFloat(transaction.amount.replace(',', '.'))
    monthlyRevenue += transaction.type === 'revenue' ? amount : -amount
  })

  return monthlyRevenue
}
