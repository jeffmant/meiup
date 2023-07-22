import { firestoreDB } from 'src/firebase/config'
import { collection, where, getDocs, query, setDoc, doc, Timestamp } from 'firebase/firestore'

// Consulta para buscar dados do documento da empresa
export const getCompanyByCnpj = async ({ cnpj }) => {
  const companyDocRef = query(collection(firestoreDB, 'companies'), where('cnpj', '==', cnpj))
  const companyDocSnap = await getDocs(companyDocRef)

  if (!companyDocSnap.empty) {
    return {
      ...companyDocSnap.docs[0].data(),
      id: companyDocSnap.docs[0].id
    }
  } else {
    return console.log('O documento da empresa não foi encontrado.')
  }
}

// Consulta para buscar dados do documento da empresa
export const getCompanyByUserId = async ({ userId }) => {
  const companyDocRef = query(collection(firestoreDB, 'companies'), where('userId', '==', userId))
  const companyDocSnap = await getDocs(companyDocRef)

  if (!companyDocSnap.empty) {
    return {
      ...companyDocSnap.docs[0].data(),
      id: companyDocSnap.docs[0].id
    }
  } else {
    return console.log('O documento da empresa não foi encontrado.')
  }
}

// Armazenar os dados da empresa obtidos em um documento na coleção 'companies'
export const saveCompanyDataToFirestore = async ({ companyData, userId }) => {
  try {
    // Criando uma referência para o documento da empresa no Firestore
    const companiesCollectionRef = collection(firestoreDB, 'companies')

    // Salvando os dados da empresa obtidos em 'companyData' no documento
    // Caso a empresa ainda não tenha sido cadastrada ele irá criar um novo documento utilizando o cnpj fornecido como id
    await setDoc(doc(companiesCollectionRef), {
      ...companyData,
      userId
    })

    console.log('Dados da empresa salvos no Firestore com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar dados da empresa no Firestore:', error)
  }
}

export const getCompanyTransactions = async ({ companyId, type, month, year }) => {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 1)

  const transactionsRef = collection(firestoreDB, 'transactions')

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
}
