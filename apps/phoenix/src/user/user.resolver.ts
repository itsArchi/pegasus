import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { User } from './entity/user.entity'
import { UserService } from './user.service'
import { CreateUserInput, UpdateUserInput } from './dto/user.dto'
import { UserListDro, DeleteUserDro } from './dro/user.dro'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(() => UserListDro, { name: 'users' })
  async findAll(): Promise<UserListDro> {
    const data = await this.service.findAll()
    return { data, total: data.length }
  }

  @Query(() => User, { name: 'user' })
  findById(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.service.findById(id) as Promise<User>
  }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.service.create(input) as Promise<User>
  }

  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    return this.service.update(id, input) as Promise<User>
  }

  @Mutation(() => DeleteUserDro)
  async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<DeleteUserDro> {
    await this.service.delete(id)
    return { success: true, message: `User "${id}" berhasil dihapus` }
  }
}
