import { z } from 'zod'
import { UserZodSchema } from './entity/user.entity'
import { UserRole } from './schema/user.schema'

export { UserRole }

export type IUser = z.infer<typeof UserZodSchema>

export interface ICreateUser {
  id?: string
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface IUpdateUser {
  name?: string
  email?: string
  password?: string
  role?: UserRole
  is_active?: boolean
}
