import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { UserRole, IUser } from '../user/user.interface'
import { CreateAdminInput } from './dto/admin.dto'
import { AdminStatsDro } from './dro/admin.dro'

@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  async findAllAdmins(): Promise<IUser[]> {
    const users = await this.userService.findAll()
    return users.filter((u) => u.role === UserRole.ADMIN)
  }

  async findAllUsers(): Promise<IUser[]> {
    return this.userService.findAll()
  }

  async createAdmin(input: CreateAdminInput): Promise<IUser> {
    const existing = await this.userService.findByEmail(input.email)
    if (existing) throw new ConflictException(`Email "${input.email}" sudah terdaftar`)
    return this.userService.create({ ...input, role: UserRole.ADMIN })
  }

  async promoteToAdmin(userId: string): Promise<IUser> {
    const user = await this.userService.findById(userId)
    if (user.role === UserRole.ADMIN) {
      throw new ConflictException(`User "${userId}" sudah menjadi admin`)
    }
    return this.userService.update(userId, { role: UserRole.ADMIN })
  }

  async demoteToUser(adminId: string): Promise<IUser> {
    const user = await this.userService.findById(adminId)
    if (user.role === UserRole.USER) {
      throw new ConflictException(`User "${adminId}" sudah berstatus user`)
    }
    return this.userService.update(adminId, { role: UserRole.USER })
  }

  async deactivateUser(userId: string): Promise<IUser> {
    const user = await this.userService.findById(userId)
    if (!user.is_active) throw new ConflictException(`User "${userId}" sudah non-aktif`)
    return this.userService.update(userId, { is_active: false })
  }

  async activateUser(userId: string): Promise<IUser> {
    const user = await this.userService.findById(userId)
    if (user.is_active) throw new ConflictException(`User "${userId}" sudah aktif`)
    return this.userService.update(userId, { is_active: true })
  }

  async getStats(): Promise<AdminStatsDro> {
    const all = await this.userService.findAll()
    return {
      totalUsers: all.length,
      totalAdmins: all.filter((u) => u.role === UserRole.ADMIN).length,
      activeUsers: all.filter((u) => u.is_active).length,
      inactiveUsers: all.filter((u) => !u.is_active).length,
    }
  }
}
