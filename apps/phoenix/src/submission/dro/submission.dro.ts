import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Submission } from '../entity/submission.entity'

@ObjectType()
export class SubmissionListDro {
  @Field(() => [Submission])
  data: Submission[]

  @Field(() => Int)
  total: number
}

@ObjectType()
export class SubmitResultDro {
  @Field()
  success: boolean

  @Field()
  message: string

  @Field(() => Submission, { nullable: true })
  submission?: Submission
}
