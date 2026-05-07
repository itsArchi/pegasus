import { ObjectType, Field, ID } from '@nestjs/graphql'
import { z } from 'zod'

export const SubmissionZodSchema = z.object({
  id: z.string().uuid(),
  campaign_id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  submitted_at: z.coerce.date().transform((d) => d.toISOString()),
})

@ObjectType()
export class Submission {
  @Field(() => ID)
  id: string

  @Field()
  campaign_id: string

  @Field()
  name: string

  @Field()
  email: string

  @Field(() => String, { nullable: true })
  phone: string | null

  @Field(() => String)
  submitted_at: string
}
