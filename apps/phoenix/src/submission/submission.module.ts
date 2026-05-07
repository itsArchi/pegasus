import { Module } from '@nestjs/common'
import { SubmissionResolver } from './submission.resolver'
import { SubmissionService } from './submission.service'
import { SubmissionRepository } from './psql/submission.repository'
import { DatabaseModule } from '../database/database.module'
import { MailModule } from '../mail/mail.module'
import { CampaignModule } from '../campaign/campaign.module'

@Module({
  imports: [DatabaseModule, MailModule, CampaignModule],
  providers: [SubmissionResolver, SubmissionService, SubmissionRepository],
})
export class SubmissionModule {}
