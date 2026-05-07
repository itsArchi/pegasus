import { Injectable, NotFoundException } from '@nestjs/common'
import { CampaignRepository } from './psql/campaign.repository'
import { CreateCampaignInput, UpdateCampaignInput } from './dto/campaign.dto'
import { ICampaign } from './campaign.interface'

@Injectable()
export class CampaignService {
  constructor(private readonly repo: CampaignRepository) {}

  findAll(status?: string): Promise<ICampaign[]> {
    return this.repo.findAll(status)
  }

  async findById(id: string): Promise<ICampaign> {
    const campaign = await this.repo.findById(id)
    if (!campaign) throw new NotFoundException(`Campaign "${id}" not found`)
    return campaign
  }

  async findBySlug(slug: string): Promise<ICampaign | null> {
    return this.repo.findBySlug(slug)
  }

  create(input: CreateCampaignInput): Promise<ICampaign> {
    return this.repo.create(input)
  }

  update(id: string, input: UpdateCampaignInput): Promise<ICampaign> {
    return this.repo.update(id, input)
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.repo.delete(id)
    if (!deleted) throw new NotFoundException(`Campaign "${id}" not found`)
    return true
  }
}
