import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { CampaignStatus } from './schema/campaign.schema'
import { Campaign } from './entity/campaign.entity'
import { CampaignService } from './campaign.service'
import { CreateCampaignInput, UpdateCampaignInput } from './dto/campaign.dto'
import { CampaignListDro, DeleteCampaignDro } from './dro/campaign.dro'

@Resolver(() => Campaign)
export class CampaignResolver {
  constructor(private readonly service: CampaignService) {}

  @Query(() => CampaignListDro, { name: 'campaigns' })
  async findAll(
    @Args('status', { type: () => CampaignStatus, nullable: true }) status?: CampaignStatus,
  ): Promise<CampaignListDro> {
    const data = await this.service.findAll(status)
    return { data, total: data.length }
  }

  @Query(() => Campaign, { name: 'campaign' })
  findById(@Args('id', { type: () => ID }) id: string): Promise<Campaign> {
    return this.service.findById(id) as Promise<Campaign>
  }

  @Query(() => Campaign, { name: 'campaignBySlug', nullable: true })
  findBySlug(@Args('slug') slug: string): Promise<Campaign | null> {
    return this.service.findBySlug(slug) as Promise<Campaign | null>
  }

  @Mutation(() => Campaign)
  createCampaign(@Args('input') input: CreateCampaignInput): Promise<Campaign> {
    return this.service.create(input) as Promise<Campaign>
  }

  @Mutation(() => Campaign)
  updateCampaign(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCampaignInput,
  ): Promise<Campaign> {
    return this.service.update(id, input) as Promise<Campaign>
  }

  @Mutation(() => DeleteCampaignDro)
  async deleteCampaign(@Args('id', { type: () => ID }) id: string): Promise<DeleteCampaignDro> {
    await this.service.delete(id)
    return { success: true, message: `Campaign "${id}" deleted successfully` }
  }
}
