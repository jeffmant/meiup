import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import { signin } from 'src/pages/api/user'
import Cookies from 'js-cookie';
import { login, logout, register, authenticationCheck } from '../pages/api/auth';
import firebaseApp from 'src/firebase/config';
import { getAuth } from 'firebase/auth';

const auth = getAuth(firebaseApp)

const USER = {
  id: '5e86809283e28b96d2d38537',
  avatar: 'https://github.com/jeffmant.png',
  phone: '11936187180',
  name: 'Jefferson Mantovani',
  email: 'jgsmantovani@gmail.com',
  cpf: '08468678937',
  company: {
    id: '7f86809283e28b96d2d38598',
    cnpj: '36255676000173',
    name: 'Jefferson Gabriel Silva Mantovani 08468678937',
    fantasyName: 'BOAZ Tecnologias'
  }
}

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
    const user = action.payload

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
              isAuthenticated: true,
              isLoading: false,
              user
            })
          : ({
              isLoading: false
            })
      )
    }
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload

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
  }
}

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
)

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

    let isAuthenticated = false

    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true'
    } catch (err) {
      console.error(err)
    }

    if (isAuthenticated) {
      const user = USER

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      })
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      })
    }
  }

  useEffect(
    () => {
      initialize()
    },
    []
  )

  const skip = () => {
    try {
      window.sessionStorage.setItem('authenticated', 'true')
    } catch (err) {
      console.error(err)
    }

    const user = USER

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    })
  }

  const signIn = async (email, password) => {
    const signedUser = login({ email, password })
    if (!signedUser) {
      throw new Error('Please check your email and password')
    }
    USER.name = (await signedUser).result.user.displayName

    const user = USER

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    })
  };

  const signUp = async (cnpj, email, name, password) => {
    register(cnpj, email, name, password)
  };

  const signOut = () => {
    logout()
      .then(
        dispatch({
        type: HANDLERS.SIGN_OUT
        })
      )
    
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node
}

export const AuthConsumer = AuthContext.Consumer

export const useAuthContext = () => useContext(AuthContext)
