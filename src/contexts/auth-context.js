import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import { login, logout, register } from '../pages/api/auth'
import fetchUserData from 'src/pages/api/user'
import Cookies from 'js-cookie'

let USER = {}

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
      isAuthenticated = Cookies.get('authenticated') === 'true'
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

  const signIn = async (email, password) => {
    try {
      const user = await login({ email, password })
      const userData = await fetchUserData(user.result.user)
      USER = userData

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: userData
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
        signOut
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
