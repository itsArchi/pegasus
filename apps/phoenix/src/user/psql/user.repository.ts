import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common'
import type { DatabasePool } from 'slonik'
import { NotFoundError, UniqueIntegrityConstraintViolationError, sql } from 'slonik'
import { IUser, ICreateUser, IUpdateUser } from '../user.interface'
import { UserZodSchema } from '../entity/user.entity'

@Injectable()
export class UserRepository {
  constructor(@Inject('SLONIK_POOL') private readonly pool: DatabasePool) {}

  async findAll(): Promise<IUser[]> {
    const rows = await this.pool.any(sql.type(UserZodSchema)`
      SELECT id, name, email, password_hash, role, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `)
    return [...rows]
  }

  async findById(id: string): Promise<IUser | null> {
    return this.pool.maybeOne(sql.type(UserZodSchema)`
      SELECT id, name, email, password_hash, role, is_active, created_at, updated_at
      FROM users
      WHERE id = ${id}::uuid
    `)
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.pool.maybeOne(sql.type(UserZodSchema)`
      SELECT id, name, email, password_hash, role, is_active, created_at, updated_at
      FROM users
      WHERE email = ${email}
    `)
  }

  async create(input: ICreateUser & { password_hash: string }): Promise<IUser> {
    const idFragment = input.id
      ? sql.fragment`${input.id}::uuid`
      : sql.fragment`gen_random_uuid()`

    try {
      return this.pool.one(sql.type(UserZodSchema)`
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES (
          ${idFragment},
          ${input.name},
          ${input.email},
          ${input.password_hash},
          ${input.role ?? 'user'}
        )
        RETURNING id, name, email, password_hash, role, is_active, created_at, updated_at
      `)
    } catch (err) {
      if (err instanceof UniqueIntegrityConstraintViolationError) {
        throw new ConflictException(`Email "${input.email}" sudah terdaftar`)
      }
      throw err
    }
  }

  async update(id: string, input: Partial<IUpdateUser & { password_hash?: string }>): Promise<IUser> {
    const setClauses: ReturnType<typeof sql.fragment>[] = []

    if (input.name !== undefined) setClauses.push(sql.fragment`name = ${input.name}`)
    if (input.email !== undefined) setClauses.push(sql.fragment`email = ${input.email}`)
    if (input.password_hash !== undefined) setClauses.push(sql.fragment`password_hash = ${input.password_hash}`)
    if (input.role !== undefined) setClauses.push(sql.fragment`role = ${input.role}`)
    if (input.is_active !== undefined) setClauses.push(sql.fragment`is_active = ${input.is_active}`)

    if (setClauses.length === 0) {
      const existing = await this.findById(id)
      if (!existing) throw new NotFoundException(`User "${id}" tidak ditemukan`)
      return existing
    }

    try {
      return this.pool.one(sql.type(UserZodSchema)`
        UPDATE users
        SET ${sql.join(setClauses, sql.fragment`, `)}, updated_at = now()
        WHERE id = ${id}::uuid
        RETURNING id, name, email, password_hash, role, is_active, created_at, updated_at
      `)
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException(`User "${id}" tidak ditemukan`)
      }
      if (err instanceof UniqueIntegrityConstraintViolationError) {
        throw new ConflictException(`Email "${input.email}" sudah terdaftar`)
      }
      throw err
    }
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.pool.maybeOne(sql.type(UserZodSchema)`
      DELETE FROM users
      WHERE id = ${id}::uuid
      RETURNING id, name, email, password_hash, role, is_active, created_at, updated_at
    `)
    return deleted !== null
  }
}
