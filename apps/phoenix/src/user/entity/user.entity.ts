import { ObjectType, Field, ID } from '@nestjs/graphql'
import { createZodDto } from '@anatine/zod-nestjs'
import { z } from 'zod'
import { UserRole } from '../schema/user.schema'

export const UserZodSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password_hash: z.string(),
  role: z.nativeEnum(UserRole),
  is_active: z.boolean(),
  created_at: z.coerce.date().transform((d) => d.toISOString()),
  updated_at: z.coerce.date().transform((d) => d.toISOString()),
})

export type IUserRow = z.infer<typeof UserZodSchema>

export class UserDto extends createZodDto(UserZodSchema) {}

@ObjectType()
export class User {
  @Field(() => ID, { description: 'UUID v4' })
  id: string

  @Field({ description: 'Nama lengkap' })
  name: string

  @Field({ description: 'Alamat email unik' })
  email: string

  @Field(() => UserRole, { description: 'Role: admin atau user' })
  role: UserRole

  @Field({ description: 'Status aktif akun' })
  is_active: boolean

  @Field(() => String)
  created_at: string

  @Field(() => String)
  updated_at: string
}
