import { Field, ID, InputType } from 'type-graphql'

import { Comment } from '.'

@InputType()
export class GetCommentInput implements Partial<Comment> {
  @Field(() => ID, { nullable: true })
  id: string
}

@InputType()
export class CreateCommentInput implements Partial<Comment> {
  @Field(() => ID)
  postId: string

  @Field(() => String)
  body: string
}

@InputType()
export class UpdateCommentInput implements Partial<Comment> {
  @Field(() => ID)
  id: string

  @Field(() => ID, { nullable: true })
  body: string
}

@InputType()
export class DeleteCommentInput implements Partial<Comment> {
  @Field(() => ID)
  id: string
}
