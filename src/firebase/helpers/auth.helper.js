import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { firebaseAuth } from '../config'
import { saveCompanyDataToFirestore } from './company.helper'

export const signin = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password)
  return user
}

export const signup = async ({ email, password, companyData }) => {
  const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password)

  await updateProfile(user, { displayName: companyData.fantasyName })

  await saveCompanyDataToFirestore({ companyData: { ...companyData, email }, userId: user.uid })

  return user
}

export const signout = async () => {
  await firebaseAuth.signOut()
}
