import { setDoc, doc } from 'firebase/firestore'
import { db } from 'src/firebase/config'

async function createTransactionDoc (docData, docId) {
  const docRef = doc(db, 'transactions', docId) // Referência ao documento existente

  try {
    await setDoc(docRef, docData) // Atualiza as informações do documento existente ou cria um novo documento
    console.log('Documento criado/atualizado com sucesso!')
  } catch {
    console.log('Houve um erro ao criar/atualizar o documento.')
  };
};

export default createTransactionDoc
