import { collection, addDoc } from 'firebase/firestore'
import { db } from 'src/firebase/config'

async function createTransactionDoc (docData) {
  const docRef = collection(db, 'transactions')

  try {
    await addDoc(docRef, docData)
    console.log('Documento criado com sucesso!')
  } catch {
    console.log('Houve um erro ao criar o documento.')
  };
};

export default createTransactionDoc
