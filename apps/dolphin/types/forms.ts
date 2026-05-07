import type { UserRole } from '@/graphql/gql/generated'

export interface UserFormState {
  name: string
  email: string
  password: string
  role: UserRole
  is_active: boolean
}

export interface RegisterFormState {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

export type UserFilter = 'all' | 'ADMIN' | 'USER'
