import type { CommentInterface } from 'shared'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Post, User } from '..'

export enum CommentErrors {
  NotFound = 'Comment not found',
  NotOwner = 'You are not owner of this comment',
}

@Entity()
@ObjectType()
export class Comment extends BaseEntity implements CommentInterface {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => String)
  @Column('text')
  body: string

  @Field(() => User)
  @ManyToOne(() => User, user => user.comments)
  user: User

  @Field(() => Post)
  @ManyToOne(() => Post, post => post.comments)
  post: Post

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: string
}
