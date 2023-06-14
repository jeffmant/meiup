import firebaseApp, { db } from '../../firebase/config'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth'
import { collection, setDoc, doc } from 'firebase/firestore'
import Cookies from 'js-cookie'
import { getCompanyInfoByCNPJ } from './company'
import { saveCompanyDataToFirestore } from './utils'

const auth = getAuth(firebaseApp)

export const login = async ({ email, password }) => {
  let result = null
  let error = null
  try {
    result = await signInWithEmailAndPassword(auth, email, password) // Método de autenticação do firebase

    const token = await result.user.getIdToken()
    Cookies.set('authenticated', token)
  } catch (e) {
    error = e
  }
  return { result, error }
}

export async function logout () {
  auth.signOut()
    .then(() => {
      Cookies.remove('authenticated')// Limpa o cookie armazenado
    })
    .catch((error) => {
      console.log('Erro ao realizar logout:', error)
    })
}

export async function register (cnpj, email, name, password) {
  const cnpjNumber = Number(cnpj.replace(/[^\d]/g, ''))
  const cnpjString = cnpjNumber.toString() // converte novamente para uma string, isso é necessário pois o documento do firestore não pode conter simbolos

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(user, { displayName: name })

    const userDocData = {
      cnpj: cnpjString,
      name,
      email
    }
    const usersCollectionRef = collection(db, 'users')
    await setDoc(doc(usersCollectionRef, user.uid), userDocData)

    // Criar doc da empresa
    const companyData = await getCompanyInfoByCNPJ({ cnpj: cnpjNumber })
    console.log('CompanyData')
    console.log(companyData)
    await saveCompanyDataToFirestore(companyData, user)

    console.log('Usuário criado com sucesso:', user)

    return user
  } catch (error) {
    console.log('Erro ao criar usuário:', error)
    throw error
  }
};
