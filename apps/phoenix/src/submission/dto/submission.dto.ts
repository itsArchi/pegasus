import { InputType, Field, ID } from '@nestjs/graphql'
import { IsString, IsEmail, IsOptional, IsUUID, MinLength, MaxLength, Matches } from 'class-validator'

@InputType()
export class CreateSubmissionInput {
  @Field(() => ID)
  @IsUUID('4')
  campaign_id: string

  @Field()
  @IsString()
  @MinLength(2, { message: 'Nama minimal 2 karakter' })
  @MaxLength(255)
  name: string

  @Field()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]{8,20}$/, { message: 'Format nomor HP tidak valid' })
  phone?: string
}
