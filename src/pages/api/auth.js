import firebaseApp from '../../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword , updateProfile, getAuth } from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Cookies from 'js-cookie';

const auth = getAuth(firebaseApp)

export const  login = async ({ email, password }) => {
  let result = null,
      error = null;
  try {
        result = await signInWithEmailAndPassword(auth, email, password); //Método de autenticação do firebase
        const user = auth.currentUser
        const token = await user.getIdToken();
        Cookies.set('authenticated', token)
        console.log(token)
        console.log('Logado com sucesso', result.user)
      
  } catch (e) {
      error = e;
  }
  return { result, error };
};

export async function logout() {
    auth.signOut()
        .then(() => {  
            Cookies.remove('authenticated');// Limpa o cookie armazenado
        })
    .catch((error) => {
      console.log('Erro ao realizar logout:', error);
    });
}

export async function register(cnpj, email, name, password) {
  const cnpjNumber = Number(cnpj.replace(/[^\d]/g, "")); //Converte cnpj para number
  const cnpjString = cnpjNumber.toString(); //converte novamente para uma string, isso é necessário pois a collection não pode conter simbolos

  try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password); //Método de criação de usuário no Firebase

      await updateProfile(user, { displayName: name }) //Atualização do nome do usuário armazenado no firebase authentication conforme nome fornecido no form

      const userDocData = { //Dados para criação do documento do user na collection users
          cnpj: cnpjString,
          name: name,
          email: email,
          //TODO: Add outros campos conforme necessidade.
      };
      const usersCollectionRef = collection(db, 'users'); //Referencia da collection users
      await setDoc(doc(usersCollectionRef, user.uid), userDocData); //Criação de um novo documento na collection users para o usuário recém criado, o id do documento é o uid do novo usuario criado.

      const companyDocData = { //Dados para criação do documento da empresa na collection companies
          fantasyName: null,
          isME: null,
          isMEI: null,
          name: null,
          userId: user.uid,
          userName: user.displayName
      };
      //TODO: Fazer a requisição na API do Infosimples para pegar as informações de cadastro da empresa.

      const companiesCollectionRef = collection(db, 'companies'); //Referencia da collection
      await setDoc(doc(companiesCollectionRef, cnpjString), companyDocData) //Criação do documento

      console.log('Usuário criado com sucesso:', user);
      console.log('Empresa criada com sucesso:', companyDocData);

      return user;
  } catch (error) {
      console.log('Erro ao criar usuário:', error);
      throw error;
  }
};
