import firebaseApp from '../../firebase/config'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth
} from 'firebase/auth'
import Cookies from 'js-cookie'
import { saveCompanyDataToFirestore } from './utils'

const auth = getAuth(firebaseApp)

export const login = async ({ email, password }) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function logout () {
  auth
    .signOut()
    .then(() => {
      Cookies.remove('accessToken') // Limpa o cookie armazenado
    })
    .catch((error) => {
      console.log('Erro ao realizar logout:', error)
    })
}

export async function register ({ email, password, companyData }) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(user, { displayName: companyData.fantasyName })

    await saveCompanyDataToFirestore({ companyData: { ...companyData, email }, userId: user.uid })

    return user
  } catch (error) {
    console.log('Erro ao criar usuário:', error)
    return error
  }
}
