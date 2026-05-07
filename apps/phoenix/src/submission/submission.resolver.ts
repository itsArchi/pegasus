import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql'
import { SubmissionService } from './submission.service'
import { CreateSubmissionInput } from './dto/submission.dto'
import { SubmitResultDro, SubmissionListDro } from './dro/submission.dro'

@Resolver()
export class SubmissionResolver {
  constructor(private readonly service: SubmissionService) {}

  @Mutation(() => SubmitResultDro, { description: 'Daftar ke event campaign' })
  async submitRegistration(
    @Args('input') input: CreateSubmissionInput,
  ): Promise<SubmitResultDro> {
    const submission = await this.service.submit(input)
    return {
      success: true,
      message: 'Pendaftaran berhasil! Kami akan menghubungi Anda segera.',
      submission,
    }
  }

  @Query(() => SubmissionListDro, { name: 'submissions', description: 'Daftar submission per campaign' })
  async findByCampaign(
    @Args('campaign_id', { type: () => ID }) campaign_id: string,
  ): Promise<SubmissionListDro> {
    const data = await this.service.findByCampaign(campaign_id)
    return { data, total: data.length }
  }
}
