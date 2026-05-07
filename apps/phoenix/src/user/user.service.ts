import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserRepository } from './psql/user.repository'
import { CreateUserInput, UpdateUserInput } from './dto/user.dto'
import { IUser } from './user.interface'

const SALT_ROUNDS = 12

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  findAll(): Promise<IUser[]> {
    return this.repo.findAll()
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.repo.findById(id)
    if (!user) throw new NotFoundException(`User "${id}" tidak ditemukan`)
    return user
  }

  findByEmail(email: string): Promise<IUser | null> {
    return this.repo.findByEmail(email)
  }

  async create(input: CreateUserInput): Promise<IUser> {
    const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)
    return this.repo.create({ ...input, password_hash })
  }

  async update(id: string, input: UpdateUserInput): Promise<IUser> {
    const patch: Parameters<UserRepository['update']>[1] = { ...input }
    if (input.password) {
      patch.password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)
      delete (patch as { password?: string }).password
    }
    return this.repo.update(id, patch)
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.repo.delete(id)
    if (!deleted) throw new NotFoundException(`User "${id}" tidak ditemukan`)
    return true
  }

  async validatePassword(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash)
  }
}
