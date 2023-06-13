// export const signin = async ({ email, password }) => {
//   return {
//     id: '5e86809283e28b96d2d38537',
//     avatar: 'https://github.com/jeffmant.png',
//     phone: '11936187180',
//     name: 'Jefferson Mantovani',
//     email: 'jgsmantovani@gmail.com',
//     cpf: '08468678937',
//     company: {
//       id: '7f86809283e28b96d2d38598',
//       name: 'Jefferson Gabriel Silva Mantovani 08468678937',
//       fantasyName: 'BOAZ Tecnologias'
//     }
//   }
// }

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
  };
};
