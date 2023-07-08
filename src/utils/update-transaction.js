import { setDoc, doc } from 'firebase/firestore'
import { db } from 'src/firebase/config'

async function updateTransactionDoc (docData, docId) {
  const docRef = doc(db, 'transactions', docId)

  try {
    await setDoc(docRef, docData)
    console.log('Documento atualizado com sucesso!')
  } catch {
    console.log('Houve um erro ao atualizar o documento.')
  };
};

export default updateTransactionDoc
