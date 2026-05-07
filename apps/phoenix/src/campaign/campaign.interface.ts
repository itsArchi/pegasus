import { z } from 'zod'
import { CampaignZodSchema } from './entity/campaign.entity'
import { CampaignStatus } from './schema/campaign.schema'

export { CampaignStatus }

export type ICampaign = z.infer<typeof CampaignZodSchema> & { created_at: string; updated_at: string }

export interface ICreateCampaign {
  id?: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  status?: CampaignStatus
}

export interface IUpdateCampaign {
  name?: string
  slug?: string
  description?: string | null
  image_url?: string | null
  status?: CampaignStatus
}
