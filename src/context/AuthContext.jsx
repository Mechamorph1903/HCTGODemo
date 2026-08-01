import { createContext, useContext } from 'react'
import { useAuth } from '../hooks/useAuth.js'

const AuthContext = createContext(null)

//runs the anonymous sign-in/profile logic once at the app root and hands uid/profile down to every page
export function AuthProvider({ children }) {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}
