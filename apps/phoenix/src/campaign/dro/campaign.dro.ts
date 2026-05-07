import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Campaign } from '../entity/campaign.entity'

@ObjectType()
export class CampaignListDro {
  @Field(() => [Campaign])
  data: Campaign[]

  @Field(() => Int)
  total: number
}

@ObjectType()
export class DeleteCampaignDro {
  @Field()
  success: boolean

  @Field()
  message: string
}
