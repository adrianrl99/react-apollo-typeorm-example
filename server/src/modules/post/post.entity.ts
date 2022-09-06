import type { PostInterface } from 'shared'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Comment, User } from '..'

export enum PostErrors {
  NotFound = 'Post not found',
  NotOwner = 'You are not owner of this post',
}

@Entity()
@ObjectType()
export class Post extends BaseEntity implements PostInterface {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => String)
  @Column()
  title: string

  @Field(() => String)
  @Column('text')
  body: string

  @Field(() => User)
  @ManyToOne(() => User, user => user.posts)
  user: User

  @Field(() => [Comment])
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: string
}
