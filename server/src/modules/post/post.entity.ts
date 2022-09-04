import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Comment, User } from '..'

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => [User])
  @ManyToOne(() => User, user => user.posts)
  user: User

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[]
}
