import { ObjectType, Field, ID } from '@nestjs/graphql'
import { createZodDto } from '@anatine/zod-nestjs'
import { z } from 'zod'
import { CampaignStatus } from '../schema/campaign.schema'

export const CampaignZodSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung',
    }),
  description: z.string().nullable(),
  image_url: z.string().url().nullable(),
  status: z.nativeEnum(CampaignStatus),
  created_at: z.coerce.date().transform((d) => d.toISOString()),
  updated_at: z.coerce.date().transform((d) => d.toISOString()),
})

export type ICampaignRow = z.infer<typeof CampaignZodSchema>

export class CampaignDto extends createZodDto(CampaignZodSchema) {}

@ObjectType()
export class Campaign {
  @Field(() => ID, {
    description: 'UUID v4 — dapat di-generate oleh client maupun server',
  })
  id: string

  @Field({ description: 'Nama campaign' })
  name: string

  @Field({ description: 'URL slug, contoh: tokyo-natsu-matsuri-2026' })
  slug: string

  @Field(() => String, { nullable: true, description: 'Deskripsi campaign' })
  description: string | null

  @Field(() => String, { nullable: true, description: 'URL gambar campaign (Cloudinary)' })
  image_url: string | null

  @Field(() => CampaignStatus)
  status: CampaignStatus

  @Field(() => String)
  created_at: string

  @Field(() => String)
  updated_at: string
}
