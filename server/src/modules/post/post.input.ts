import { FilterPostByInputInterface, FilterUserByInputInterface } from 'shared'
import { Field, ID, InputType } from 'type-graphql'

import { FilterUserByInput } from '../user'
import { Post } from '.'

@InputType()
export class GetPostInput implements Partial<Post> {
  @Field(() => ID)
  id: string
}

@InputType()
export class CreatePostInput implements Partial<Post> {
  @Field(() => String)
  title: string

  @Field(() => String)
  body: string
}

@InputType()
export class UpdatePostInput implements Partial<Post> {
  @Field(() => ID)
  id: string

  @Field(() => ID, { nullable: true })
  title: string

  @Field(() => ID, { nullable: true })
  body: string
}

@InputType()
export class DeletePostInput implements Partial<Post> {
  @Field(() => ID)
  id: string
}

@InputType()
export class FilterPostByInput implements FilterPostByInputInterface {
  @Field(() => ID, { nullable: true })
  id: string

  @Field(() => FilterUserByInput, { nullable: true })
  user: FilterUserByInputInterface
}
