import { collection, doc, deleteDoc } from 'firebase/firestore'
import { db } from 'src/firebase/config'

async function deleteTransaction (docId) {
  const transactionRef = doc(collection(db, 'transactions'), docId)

  try {
    // deletar documento
    await deleteDoc(transactionRef)
    console.log('Transação deleta com sucesso!')
  } catch {
    console.log('Houve um erro ao deletar o documento.')
  };
};

export default deleteTransaction
