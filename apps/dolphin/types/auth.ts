import type { AuthUser } from '@/graphql/gql/generated'

export interface AuthState {
  token: string | null
  user: AuthUser | null
}

export interface AuthContextValue extends AuthState {
  login: (token: string, user: AuthUser) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}
