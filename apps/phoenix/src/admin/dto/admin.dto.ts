import { InputType, Field, ID } from '@nestjs/graphql'
import { IsString, IsEmail, IsUUID, IsOptional, MinLength, MaxLength } from 'class-validator'

@InputType()
export class CreateAdminInput {
  @Field(() => ID, { nullable: true, description: 'UUID opsional' })
  @IsOptional()
  @IsUUID('4')
  id?: string

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string

  @Field()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string

  @Field({ description: 'Password minimal 8 karakter' })
  @IsString()
  @MinLength(8)
  password: string
}

@InputType()
export class PromoteUserInput {
  @Field(() => ID, { description: 'ID user yang akan dijadikan admin' })
  @IsUUID('4')
  userId: string
}

@InputType()
export class DemoteAdminInput {
  @Field(() => ID, { description: 'ID admin yang akan diturunkan menjadi user' })
  @IsUUID('4')
  adminId: string
}
