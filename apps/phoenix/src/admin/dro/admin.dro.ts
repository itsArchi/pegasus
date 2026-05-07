import { ObjectType, Field, Int } from '@nestjs/graphql'
import { User } from '../../user/entity/user.entity'

@ObjectType()
export class AdminListDro {
  @Field(() => [User])
  data: User[]

  @Field(() => Int)
  total: number
}

@ObjectType()
export class AdminStatsDro {
  @Field(() => Int, { description: 'Total semua user' })
  totalUsers: number

  @Field(() => Int, { description: 'Total admin' })
  totalAdmins: number

  @Field(() => Int, { description: 'Total user aktif' })
  activeUsers: number

  @Field(() => Int, { description: 'Total user non-aktif' })
  inactiveUsers: number
}

@ObjectType()
export class AdminActionDro {
  @Field()
  success: boolean

  @Field()
  message: string

  @Field(() => User, { nullable: true })
  user?: User
}
