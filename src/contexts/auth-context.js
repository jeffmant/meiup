import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import { saveCompanyDataToFirestore, getCompanyByUserId } from '../firebase/helpers/company.helper'
import { updateDoc, doc } from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from 'src/firebase/config'
import jwtDecode from 'jwt-decode'
import { signin, signout, signup } from 'src/firebase/helpers/auth.helper'

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
}

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const { user } = action.payload || {}
    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user
          }
        : {
            isLoading: false
          })
    }
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const { user } = action.payload

    return {
      ...state,
      isAuthenticated: true,
      user
    }
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    }
  },
  [HANDLERS.UPDATE_USER_PROFILE]: (state, action) => {
    const { name, cpf, email, phone } = action.payload

    return {
      ...state,
      user: {
        ...state.user,
        name,
        cpf,
        email,
        phone
      }
    }
  }
}

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined })

export const AuthProvider = (props) => {
  const { children } = props
  const [state, dispatch] = useReducer(reducer, initialState)
  const initialized = useRef(false)

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return
    }

    initialized.current = true

    let loggedUser = null
    let userCompany = null

    try {
      const accessToken = Cookies.get('accessToken')

      if (accessToken) {
        const decodedAccessToken = jwtDecode(accessToken)
        firebaseAuth.onAuthStateChanged(async (user) => {
          if (user && user.uid === decodedAccessToken?.user_id) {
            loggedUser = user
            userCompany = await getCompanyByUserId({ userId: loggedUser.uid })
            dispatch({
              type: HANDLERS.INITIALIZE,
              payload: {
                user: loggedUser
                  ? {
                      id: loggedUser.uid,
                      accessToken: loggedUser.accessToken,
                      name: loggedUser.displayName,
                      email: loggedUser.email,
                      emailVerified: loggedUser.emailVerified,
                      phone: loggedUser.phoneNumber,
                      avatar: loggedUser.photoURL,
                      company: userCompany
                    }
                  : null
              }
            })
          } else {
            Cookies.remove('accessToken')
          }
        })
      }
      dispatch({
        type: HANDLERS.INITIALIZE
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  const signIn = async ({ email, password }) => {
    try {
      const loggedUser = await signin({ email, password })

      const company = await getCompanyByUserId({ userId: loggedUser.uid })

      if (!company) {
        throw new Error('Empresa não está cadastrada')
      }

      const { uid: id, accessToken, displayName: name, email: loggedUserEmail, emailVerified, phoneNumber: phone, photoURL: avatar } = loggedUser

      Cookies.set('accessToken', accessToken)

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: {
          user: {
            id,
            accessToken,
            name,
            email: loggedUserEmail,
            emailVerified,
            phone,
            avatar,
            company
          }
        }
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  const signUp = async ({ email, password, companyData }) => {
    const registeredUser = await signup({ email, password, companyData })

    if (registeredUser) {
      const company = await getCompanyByUserId({ userId: registeredUser.uid })

      if (!company) {
        throw new Error('Empresa não está cadastrada')
      }

      const { uid: id, accessToken, displayName: name, email, emailVerified, phoneNumber: phone, photoURL: avatar } = registeredUser

      Cookies.set('accessToken', accessToken)

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: {
          user: {
            id,
            accessToken,
            name,
            email,
            emailVerified,
            phone,
            avatar,
            company
          }
        }
      })
    } else {
      throw new Error('Não foi possível cadastrar MEI')
    }
  }

  const signOut = async () => {
    await signout()
    Cookies.remove('accessToken')
    dispatch({
      type: HANDLERS.SIGN_OUT
    })
  }

  const updateUserProfile = async ({ companyId, companyData }) => {
    try {
      const updatedCompany = await updateDoc(doc(firestoreDB, 'companies', companyId), companyData)
      const loggedUser = firebaseAuth.currentUser

      const { accessToken, displayName: name, email, emailVerified, phoneNumber: phone, photoURL: avatar } = loggedUser

      dispatch({
        type: HANDLERS.UPDATE_USER_PROFILE,
        payload: {
          accessToken,
          name,
          email,
          emailVerified,
          phone,
          avatar,
          company: updatedCompany
        }
      })

      console.log('Perfil do usuário atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar o perfil do usuário:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        saveCompanyDataToFirestore,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node,
  loggedUser: PropTypes.object
}

export const AuthConsumer = AuthContext.Consumer

export const useAuthContext = () => useContext(AuthContext)
