import { ObjectType, Field, Int } from '@nestjs/graphql'
import { User } from '../entity/user.entity'

@ObjectType()
export class UserListDro {
  @Field(() => [User])
  data: User[]

  @Field(() => Int)
  total: number
}

@ObjectType()
export class DeleteUserDro {
  @Field()
  success: boolean

  @Field()
  message: string
}
