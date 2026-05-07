import { InputType, Field, ID, OmitType, PartialType } from '@nestjs/graphql'
import {
  IsString, IsOptional, IsEnum, IsUUID, IsEmail,
  IsBoolean, MinLength, MaxLength,
} from 'class-validator'
import { UserRole } from '../schema/user.schema'

@InputType()
export class CreateUserInput {
  @Field(() => ID, {
    nullable: true,
    description: 'UUID opsional — jika tidak diisi, server akan generate otomatis',
  })
  @IsOptional()
  @IsUUID('4')
  id?: string

  @Field({ description: 'Nama lengkap' })
  @IsString()
  @MinLength(2, { message: 'Nama minimal 2 karakter' })
  @MaxLength(255)
  name: string

  @Field({ description: 'Email unik untuk login' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string

  @Field({ description: 'Password minimal 8 karakter' })
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string

  @Field(() => UserRole, { nullable: true, defaultValue: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['id'] as const),
) {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean
}
