import { db } from '../../firebase/config'
import { collection, getDoc, doc } from 'firebase/firestore'

export default async function fetchUserData (user) {
  const uid = user.uid
  try {
    const userDocRef = doc(collection(db, 'users'), uid)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      const { avatar, phone, name, email, cpf, cnpj } = userData

      // Atribua os dados do usuário à variável USER
      const USER = {
        id: uid || '', // Use o valor do id, ou uma string vazia se for nulo ou indefinido
        avatar: avatar || '',
        phone: phone || '',
        name: name || '',
        email: email || '',
        cpf: cpf || '',
        company: cnpj || ''
      }

      console.log('>>>USUARIO<<<')
      console.log(USER) // Exiba a estrutura do usuário preenchida com os dados
      return USER
    }
  } catch (error) {
    console.error('Erro ao buscar os dados do usuário e da empresa:', error)
  }
}
