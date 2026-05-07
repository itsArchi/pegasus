import { InputType, Field, ID, OmitType, PartialType } from '@nestjs/graphql'
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator'
import { CampaignStatus } from '../schema/campaign.schema'

@InputType()
export class CreateCampaignInput {
  @Field(() => ID, {
    nullable: true,
    description: 'UUID opsional — jika tidak diisi, server akan generate otomatis',
  })
  @IsOptional()
  @IsUUID('4', { message: 'id harus berupa UUID v4 yang valid' })
  id?: string

  @Field({ description: 'Nama campaign' })
  @IsString()
  @MinLength(1, { message: 'Nama tidak boleh kosong' })
  @MaxLength(255)
  name: string

  @Field({ description: 'URL slug, contoh: tokyo-natsu-matsuri-2026' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung',
  })
  slug: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string

  @Field({ nullable: true, description: 'URL gambar dari Cloudinary' })
  @IsOptional()
  @IsString()
  image_url?: string

  @Field(() => CampaignStatus, { nullable: true, defaultValue: CampaignStatus.DRAFT })
  @IsOptional()
  @IsEnum(CampaignStatus, { message: 'Status harus DRAFT atau PUBLISHED' })
  status?: CampaignStatus
}

@InputType()
export class UpdateCampaignInput extends PartialType(
  OmitType(CreateCampaignInput, ['id'] as const),
) {}
