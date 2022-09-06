import { IsAlphanumeric, IsEmail, Length } from 'class-validator'
import type { SignUserInterface, UserInterface } from 'shared'
import { UserRole } from 'shared'
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Comment, Post } from '..'

registerEnumType(UserRole, {
  name: 'UserRole',
})

export enum UserErrors {
  EmailExist = 'Email already exists',
  InvalidAlphanumeric = 'Username can only contain alphanumeric characters',
  InvalidCredentials = 'Invalid credentials',
  InvalidEmail = 'Invalid email',
  InvalidFields = 'Invalid fields',
  InvalidLength = 'Username can only contain 3 to 16 characters',
  NotFound = 'User not found',
  UserExists = 'User already exists',
  UsernameExist = 'Username already exists',
}

@Entity()
@ObjectType()
export class User extends BaseEntity implements UserInterface {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => String)
  @Column({ unique: true })
  @IsAlphanumeric(undefined, { message: UserErrors.InvalidAlphanumeric })
  @Length(3, 16, { message: UserErrors.InvalidLength })
  username: string

  @Field(() => String)
  @Column({ unique: true })
  @IsEmail(undefined, { message: UserErrors.InvalidEmail })
  email: string

  @Column()
  password: string

  @Field(() => UserRole)
  @Column({ default: UserRole.GUEST })
  role: UserRole

  @Column({ default: '' })
  token: string

  @Field(() => [Post])
  @OneToMany(() => Post, post => post.user)
  posts: Post[]

  @Field(() => [Comment])
  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: string
}

@ObjectType()
export class SignUser implements SignUserInterface {
  @Field(() => String)
  token: string

  @Field(() => User)
  user: User
}
