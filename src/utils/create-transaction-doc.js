import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from 'src/firebase/config'

async function createTransactionDoc (docData) {
  const docRef = collection(db, 'transactions')

  try {
    await addDoc(docRef, { ...docData, createdAt: Timestamp.fromDate(new Date()) })
    console.log('Documento criado com sucesso!')
  } catch {
    console.log('Houve um erro ao criar o documento.')
  }
}

export default createTransactionDoc
