import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Post, User } from '..'

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => [User])
  @ManyToOne(() => User, user => user.comments)
  user: User

  @Field(() => [Post])
  @ManyToOne(() => Post, post => post.comments)
  post: Post
}
