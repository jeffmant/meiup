import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import { login, logout, register } from '../pages/api/auth'
import fetchUserData from 'src/pages/api/user'
import Cookies from 'js-cookie'
import { saveCompanyDataToFirestore, getCompanyDocument } from 'src/pages/api/utils'

let USER = {}
let COMPANY = {}

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
    const { user, company } = action.payload

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
              isAuthenticated: true,
              isLoading: false,
              user: {
                ...user,
                company
              }
            })
          : ({
              isLoading: false
            })
      )
    }
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const { user, company } = action.payload

    return {
      ...state,
      isAuthenticated: true,
      user: {
        ...user,
        company
      }
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
      isAuthenticated = Cookies.get('authenticated') === 'true'
    } catch (err) {
      console.error(err)
    }

    if (isAuthenticated) {
      const user = USER
      const company = COMPANY

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: {
          user,
          company
        }
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

  const signIn = async (email, password) => {
    try {
      const userResult = await login({ email, password })
      const userData = await fetchUserData(userResult.result.user)
      const company = await getCompanyDocument(userData.company)

      COMPANY = company
      USER = userData
      const user = userData

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: {
          user,
          company
        }
      })
    } catch (error) {
      throw new Error('Please check your email and password')
    }
  }

  const signUp = async (cnpj, email, name, password) => {
    register(cnpj, email, name, password)
  }

  const signOut = () => {
    logout()
      .then(
        dispatch({
          type: HANDLERS.SIGN_OUT
        })
      )
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        saveCompanyDataToFirestore,
        getCompanyDocument
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
