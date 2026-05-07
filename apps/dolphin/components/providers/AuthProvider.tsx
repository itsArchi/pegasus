'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { AuthUser } from '@/graphql/gql/generated'
import type { AuthState, AuthContextValue } from '@/types'

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'dolphin_token'
const USER_KEY = 'dolphin_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, user: null })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw = localStorage.getItem(USER_KEY)
    if (token && raw) {
      try {
        setState({ token, user: JSON.parse(raw) })
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setHydrated(true)
  }, [])

  const login = useCallback((token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setState({ token, user })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setState({ token: null, user: null })
  }, [])

  if (!hydrated) return null

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isAuthenticated: !!state.token && !!state.user,
        isAdmin: state.user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
