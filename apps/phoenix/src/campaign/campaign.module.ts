import { Module } from '@nestjs/common'
import { CampaignResolver } from './campaign.resolver'
import { CampaignService } from './campaign.service'
import { CampaignRepository } from './psql/campaign.repository'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [CampaignResolver, CampaignService, CampaignRepository],
  exports: [CampaignService],
})
export class CampaignModule {}
