import { registerEnumType } from '@nestjs/graphql'

export enum CampaignStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

registerEnumType(CampaignStatus, {
  name: 'CampaignStatus',
  description: 'Campaign publication status',
})
