import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common'
import type { DatabasePool } from 'slonik'
import { NotFoundError, UniqueIntegrityConstraintViolationError, sql } from 'slonik'
import { ICampaign, ICreateCampaign, IUpdateCampaign } from '../campaign.interface'
import { CampaignZodSchema } from '../entity/campaign.entity'

@Injectable()
export class CampaignRepository {
  constructor(@Inject('SLONIK_POOL') private readonly pool: DatabasePool) {}

  async findAll(status?: string): Promise<ICampaign[]> {
    const rows = await this.pool.any(sql.type(CampaignZodSchema)`
      SELECT id, name, slug, description, image_url, status, created_at, updated_at
      FROM campaigns
      ${status ? sql.fragment`WHERE status = ${status}` : sql.fragment``}
      ORDER BY created_at DESC
    `)
    return [...rows]
  }

  async findById(id: string): Promise<ICampaign | null> {
    return this.pool.maybeOne(sql.type(CampaignZodSchema)`
      SELECT id, name, slug, description, image_url, status, created_at, updated_at
      FROM campaigns
      WHERE id = ${id}::uuid
    `)
  }

  async findBySlug(slug: string): Promise<ICampaign | null> {
    return this.pool.maybeOne(sql.type(CampaignZodSchema)`
      SELECT id, name, slug, description, image_url, status, created_at, updated_at
      FROM campaigns
      WHERE slug = ${slug}
    `)
  }

  async create(input: ICreateCampaign): Promise<ICampaign> {
    const idFragment = input.id
      ? sql.fragment`${input.id}::uuid`
      : sql.fragment`gen_random_uuid()`

    try {
      return this.pool.one(sql.type(CampaignZodSchema)`
        INSERT INTO campaigns (id, name, slug, description, image_url, status)
        VALUES (
          ${idFragment},
          ${input.name},
          ${input.slug},
          ${input.description ?? null},
          ${input.image_url ?? null},
          ${input.status ?? 'draft'}
        )
        RETURNING id, name, slug, description, image_url, status, created_at, updated_at
      `)
    } catch (err) {
      if (err instanceof UniqueIntegrityConstraintViolationError) {
        throw new ConflictException(`Slug "${input.slug}" sudah digunakan`)
      }
      throw err
    }
  }

  async update(id: string, input: IUpdateCampaign): Promise<ICampaign> {
    const setClauses: ReturnType<typeof sql.fragment>[] = []

    if (input.name !== undefined) setClauses.push(sql.fragment`name = ${input.name}`)
    if (input.slug !== undefined) setClauses.push(sql.fragment`slug = ${input.slug}`)
    if (input.description !== undefined) {
      setClauses.push(sql.fragment`description = ${input.description ?? null}`)
    }
    if (input.image_url !== undefined) {
      setClauses.push(sql.fragment`image_url = ${input.image_url ?? null}`)
    }
    if (input.status !== undefined) setClauses.push(sql.fragment`status = ${input.status}`)

    if (setClauses.length === 0) {
      const existing = await this.findById(id)
      if (!existing) throw new NotFoundException(`Campaign "${id}" tidak ditemukan`)
      return existing
    }

    try {
      return this.pool.one(sql.type(CampaignZodSchema)`
        UPDATE campaigns
        SET ${sql.join(setClauses, sql.fragment`, `)}, updated_at = now()
        WHERE id = ${id}::uuid
        RETURNING id, name, slug, description, status, created_at, updated_at
      `)
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException(`Campaign "${id}" tidak ditemukan`)
      }
      if (err instanceof UniqueIntegrityConstraintViolationError) {
        throw new ConflictException(`Slug "${input.slug}" sudah digunakan`)
      }
      throw err
    }
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.pool.maybeOne(sql.type(CampaignZodSchema)`
      DELETE FROM campaigns
      WHERE id = ${id}::uuid
      RETURNING id, name, slug, description, status, created_at, updated_at
    `)
    return deleted !== null
  }
}
