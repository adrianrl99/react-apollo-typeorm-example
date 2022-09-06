import {
  FilterUserByInputInterface,
  SignInUserInterface,
  SignUpUserInterface,
} from 'shared'
import { Field, ID, InputType } from 'type-graphql'

import { User } from './user.entity'

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field(() => String)
  username: string

  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field(() => ID)
  id: string

  @Field(() => String, { nullable: true })
  username: string

  @Field(() => String, { nullable: true })
  password: string

  @Field(() => String, { nullable: true })
  email: string
}

@InputType()
export class GetUserInput implements Partial<User> {
  @Field(() => ID, { nullable: true })
  id: string

  @Field(() => String, { nullable: true })
  username: string

  @Field(() => String, { nullable: true })
  email: string
}

@InputType()
export class DeleteUserInput implements Partial<User> {
  @Field(() => ID, { nullable: true })
  id: string

  @Field(() => String, { nullable: true })
  username: string

  @Field(() => String, { nullable: true })
  email: string
}

@InputType()
export class SignInUser implements SignInUserInterface {
  @Field(() => String)
  username: string

  @Field(() => String)
  password: string
}

@InputType()
export class SignUpUser implements SignUpUserInterface {
  @Field(() => String)
  username: string

  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}

@InputType()
export class UpdateSelfUserInput implements Partial<User> {
  @Field(() => String, { nullable: true })
  username: string

  @Field(() => String, { nullable: true })
  password: string

  @Field(() => String, { nullable: true })
  email: string
}

@InputType()
export class FilterUserByInput implements FilterUserByInputInterface {
  @Field(() => ID, { nullable: true })
  id: string

  @Field(() => String, { nullable: true })
  username: string

  @Field(() => String, { nullable: true })
  email: string
}
