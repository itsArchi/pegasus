import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'
import { UserRole } from '../../user/schema/user.schema'

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string

  @Field()
  @IsString()
  password: string
}

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @MinLength(2, { message: 'Nama minimal 2 karakter' })
  name: string

  @Field()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string

  @Field()
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string

  @Field(() => UserRole, { nullable: true, defaultValue: UserRole.USER, description: 'Default: USER' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
