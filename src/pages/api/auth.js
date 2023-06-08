import firebaseApp from '../../firebase/config'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'

const auth = getAuth(firebaseApp)

export default async function signIn (email, password) {
  let result = null
  let error = null
  try {
    result = await signInWithEmailAndPassword(auth, email, password)
    console.log(result.user)
  } catch (e) {
    error = e
  }

  return { result, error }
}
