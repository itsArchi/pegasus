import { Injectable, Inject } from '@nestjs/common'
import type { DatabasePool } from 'slonik'
import { sql } from 'slonik'
import { SubmissionZodSchema } from '../entity/submission.entity'
import { CreateSubmissionInput } from '../dto/submission.dto'

type ISubmission = {
  id: string
  campaign_id: string
  name: string
  email: string
  phone: string | null
  submitted_at: string
}

@Injectable()
export class SubmissionRepository {
  constructor(@Inject('SLONIK_POOL') private readonly pool: DatabasePool) {}

  async create(input: CreateSubmissionInput): Promise<ISubmission> {
    return this.pool.one(sql.type(SubmissionZodSchema)`
      INSERT INTO submissions (campaign_id, name, email, phone)
      VALUES (
        ${input.campaign_id}::uuid,
        ${input.name},
        ${input.email},
        ${input.phone ?? null}
      )
      RETURNING id, campaign_id, name, email, phone, submitted_at
    `) as Promise<ISubmission>
  }

  async findByCampaign(campaign_id: string): Promise<ISubmission[]> {
    const rows = await this.pool.any(sql.type(SubmissionZodSchema)`
      SELECT id, campaign_id, name, email, phone, submitted_at
      FROM submissions
      WHERE campaign_id = ${campaign_id}::uuid
      ORDER BY submitted_at DESC
    `)
    return [...rows] as ISubmission[]
  }
}
