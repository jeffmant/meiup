import { db } from 'src/firebase/config'
import { getDoc, setDoc, doc, collection } from 'firebase/firestore'

// Consulta para buscar dados do documento do usuário
export const getUserData = async (userId) => {
  const userDocRef = doc(collection(db, 'users'), userId)
  const userDocSnap = await getDoc(userDocRef)

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data()
    console.log('Dados do usuário:', userData)
    return userData
  } else {
    console.log('O documento de usuário não foi encontrado.')
  }
}

// Consulta para buscar dados do documento da empresa
export const getCompanyDocument = async (cnpj) => {
  const companyDocRef = doc(collection(db, 'companies'), cnpj)
  const companyDocSnap = await getDoc(companyDocRef)

  if (companyDocSnap.exists()) {
    const data = companyDocSnap.data()
    console.log('Dados da empresa:', data)
    return data
    // Tratar os dados da empresa
  } else {
    return console.log('O documento da empresa não foi encontrado.')
  }
}

// Armazenar os dados da empresa obtidos em um documento na coleção 'companies'
export const saveCompanyDataToFirestore = async (companyData, user) => {
  try {
    const { cnpj, companyName, fantasyName, status, email, phone, foundationDate, address } =
      companyData.data
    console.log(cnpj)

    const userUid = user.uid
    const userName = user.displayName

    // Criando uma referência para o documento da empresa no Firestore
    const companiesCollectionRef = collection(db, 'companies')

    // Salvando os dados da empresa obtidos em 'companyData' no documento
    // Caso a empresa ainda não tenha sido cadastrada ele irá criar um novo documento utilizando o cnpj fornecido como id
    await setDoc(doc(companiesCollectionRef, cnpj), {
      cnpj,
      companyName,
      fantasyName,
      status,
      email,
      phone,
      foundationDate,
      address,
      userUid,
      userName
    })

    console.log('Dados da empresa salvos no Firestore com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar dados da empresa no Firestore:', error)
  }
}
