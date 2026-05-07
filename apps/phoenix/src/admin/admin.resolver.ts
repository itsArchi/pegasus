import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { User } from '../user/entity/user.entity'
import { AdminService } from './admin.service'
import { CreateAdminInput, PromoteUserInput, DemoteAdminInput } from './dto/admin.dto'
import { AdminListDro, AdminStatsDro, AdminActionDro } from './dro/admin.dro'

@Resolver()
export class AdminResolver {
  constructor(private readonly service: AdminService) {}

  @Query(() => AdminListDro, { name: 'admins', description: 'Daftar semua admin' })
  async findAllAdmins(): Promise<AdminListDro> {
    const data = await this.service.findAllAdmins()
    return { data, total: data.length }
  }

  @Query(() => AdminListDro, { name: 'allUsers', description: 'Daftar semua user (admin & user)' })
  async findAllUsers(): Promise<AdminListDro> {
    const data = await this.service.findAllUsers()
    return { data, total: data.length }
  }

  @Query(() => AdminStatsDro, { name: 'adminStats', description: 'Statistik user & admin' })
  getStats(): Promise<AdminStatsDro> {
    return this.service.getStats()
  }

  @Mutation(() => User, { description: 'Buat akun admin baru' })
  createAdmin(@Args('input') input: CreateAdminInput): Promise<User> {
    return this.service.createAdmin(input) as Promise<User>
  }

  @Mutation(() => AdminActionDro, { description: 'Jadikan user biasa menjadi admin' })
  async promoteToAdmin(@Args('input') { userId }: PromoteUserInput): Promise<AdminActionDro> {
    const user = await this.service.promoteToAdmin(userId)
    return { success: true, message: `User berhasil dipromosikan menjadi admin`, user: user as User }
  }

  @Mutation(() => AdminActionDro, { description: 'Turunkan admin menjadi user biasa' })
  async demoteToUser(@Args('input') { adminId }: DemoteAdminInput): Promise<AdminActionDro> {
    const user = await this.service.demoteToUser(adminId)
    return { success: true, message: `Admin berhasil diturunkan menjadi user`, user: user as User }
  }

  @Mutation(() => AdminActionDro, { description: 'Non-aktifkan akun user' })
  async deactivateUser(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<AdminActionDro> {
    const user = await this.service.deactivateUser(userId)
    return { success: true, message: `Akun berhasil di-nonaktifkan`, user: user as User }
  }

  @Mutation(() => AdminActionDro, { description: 'Aktifkan kembali akun user' })
  async activateUser(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<AdminActionDro> {
    const user = await this.service.activateUser(userId)
    return { success: true, message: `Akun berhasil diaktifkan`, user: user as User }
  }
}
