import { db } from 'src/firebase/config'
import { setDoc, doc, collection, where, getDocs, query } from 'firebase/firestore'

// Consulta para buscar dados do documento da empresa
export const getCompanyByCnpj = async ({ cnpj }) => {
  const companyDocRef = query(collection(db, 'companies'), where('cnpj', '==', cnpj))
  const companyDocSnap = await getDocs(companyDocRef)

  if (!companyDocSnap.empty) {
    return {
      id: companyDocSnap.docs[0].id,
      ...companyDocSnap.docs[0].data()
    }
  } else {
    return console.log('O documento da empresa não foi encontrado.')
  }
}

// Consulta para buscar dados do documento da empresa
export const getCompanyByUserId = async ({ userId }) => {
  const companyDocRef = query(collection(db, 'companies'), where('userId', '==', userId))
  const companyDocSnap = await getDocs(companyDocRef)

  if (!companyDocSnap.empty) {
    return {
      id: companyDocSnap.docs[0].id,
      ...companyDocSnap.docs[0].data()
    }
  } else {
    return console.log('O documento da empresa não foi encontrado.')
  }
}

// Armazenar os dados da empresa obtidos em um documento na coleção 'companies'
export const saveCompanyDataToFirestore = async ({ companyData, userId }) => {
  try {
    // Criando uma referência para o documento da empresa no Firestore
    const companiesCollectionRef = collection(db, 'companies')

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
