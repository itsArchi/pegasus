import { Injectable } from '@nestjs/common'
import { SubmissionRepository } from './psql/submission.repository'
import { CreateSubmissionInput } from './dto/submission.dto'
import { MailService } from '../mail/mail.service'
import { CampaignService } from '../campaign/campaign.service'

@Injectable()
export class SubmissionService {
  constructor(
    private readonly repo: SubmissionRepository,
    private readonly mail: MailService,
    private readonly campaignService: CampaignService,
  ) {}

  async submit(input: CreateSubmissionInput) {
    const submission = await this.repo.create(input)

    this.campaignService.findById(input.campaign_id)
      .then((campaign) =>
        this.mail.sendRegistrationConfirmation({
          to: input.email,
          name: input.name,
          campaignName: campaign.name,
          campaignSlug: campaign.slug,
        }),
      )
      .then(() => console.log(`[Mail] Email terkirim ke ${input.email}`))
      .catch((err) => console.error('[Mail] Gagal kirim email konfirmasi:', err.message, err.code ?? ''))

    return submission
  }

  async findByCampaign(campaign_id: string) {
    return this.repo.findByCampaign(campaign_id)
  }
}
