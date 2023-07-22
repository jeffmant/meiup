import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { firestoreDB } from 'src/firebase/config'

async function createTransactionDoc (docData) {
  const docRef = collection(firestoreDB, 'transactions')
  const createdAt = Timestamp.fromDate(new Date(docData.date))

  try {
    await addDoc(docRef, { ...docData, createdAt })
    console.log('Documento criado com sucesso!')
  } catch {
    console.log('Houve um erro ao criar o documento.')
  }
}

export default createTransactionDoc
