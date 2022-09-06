import { Context as ApolloContext, UserInputError } from 'apollo-server-core'
import { validate } from 'class-validator'
import jwt from 'jsonwebtoken'
import { UserRole } from 'shared'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Not } from 'typeorm'

import Config from '../../Config'
import type { Context } from '../../types'
import {
  CreateUserInput,
  DeleteUserInput,
  GetUserInput,
  SignInUser,
  SignUpUser,
  SignUser,
  UpdateSelfUserInput,
  UpdateUserInput,
  User,
  UserErrors,
} from '.'

@Resolver(() => User)
export class UserResolver {
  @Authorized(UserRole.ADMIN)
  @Query(() => [User])
  async users() {
    return User.find({ relations: { posts: true, comments: true } })
  }

  @Authorized(UserRole.ADMIN)
  @Query(() => User)
  async user(@Arg('data') { email, id, username }: GetUserInput) {
    const user = await User.findOne({
      where: [{ id }, { username }, { email }],
      relations: { posts: true, comments: true },
    })
    if (!user) throw new UserInputError(UserErrors.NotFound)
    return user
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => User)
  async createUser(
    @Arg('data') { email, password, username }: CreateUserInput,
  ) {
    const userByUsername = await User.findOneBy({ username })
    const userByEmail = await User.findOneBy({ email })

    if (userByUsername || userByEmail)
      throw new UserInputError(UserErrors.UserExists, {
        errorData: {
          username: userByUsername ? UserErrors.UsernameExist : undefined,
          email: userByEmail ? UserErrors.EmailExist : undefined,
        },
      })

    const user = new User()
    user.email = email
    user.username = username
    user.password = password
    user.posts = []
    user.comments = []
    const errors = await validate(user)
    if (errors.length)
      throw new UserInputError(UserErrors.InvalidFields, {
        errorData: Object.fromEntries(
          errors.map(v => [v.property, v.constraints]),
        ),
      })

    return await user.save()
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => User)
  async updateUser(
    @Arg('data') { email, id, password, username }: UpdateUserInput,
  ) {
    const user = await User.findOne({
      where: { id },
      relations: { posts: true, comments: true },
    })
    if (!user) throw new UserInputError(UserErrors.NotFound)
    if (username) {
      if (await User.findOneBy({ username }))
        throw new UserInputError(UserErrors.UserExists, {
          errorData: {
            username: UserErrors.UsernameExist,
          },
        })
      user.username = username
    }
    if (email) {
      if (await User.findOneBy({ email }))
        throw new UserInputError(UserErrors.UserExists, {
          errorData: {
            email: UserErrors.EmailExist,
          },
        })
      user.email = email
    }
    if (password) user.password = password
    return await user.save()
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteUser(@Arg('data') { email, id, username }: DeleteUserInput) {
    const user = await User.findOne({
      where: [{ id }, { username }, { email }],
    })
    if (!user) throw new UserInputError(UserErrors.NotFound)
    await Promise.all(user.posts.map(post => post.remove()))
    await user.remove()
    return true
  }

  @Mutation(() => SignUser)
  async signUp(@Arg('data') data: SignUpUser) {
    const user = await this.createUser(data)

    const token = jwt.sign(
      {
        id: user.id,
      },
      Config.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    )

    user.token = token

    return { user: await user.save(), token }
  }

  @Mutation(() => SignUser)
  async signIn(@Arg('data') data: SignInUser) {
    console.log(data)

    const user = await User.findOne({
      where: {
        username: data.username,
        password: data.password,
      },
      relations: { posts: true, comments: true },
    })
    if (!user) throw new UserInputError(UserErrors.InvalidCredentials)

    const token = jwt.sign(
      {
        id: user.id,
      },
      Config.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    )

    user.token = token

    return { user: await user.save(), token }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() { user }: ApolloContext<Context>) {
    if (!user) return false
    user.token = ''
    await user.save()
    return true
  }

  @Authorized()
  @Query(() => User)
  async getSelf(@Ctx() { user }: ApolloContext<Context>) {
    return user
  }

  @Authorized()
  @Mutation(() => User)
  async updateSelf(
    @Arg('data') { email, password, username }: UpdateSelfUserInput,
    @Ctx() { user }: ApolloContext<Context>,
  ) {
    if (!user) throw new UserInputError(UserErrors.NotFound)
    if (username) {
      if (await User.findOneBy({ username, id: Not(user.id) }))
        throw new UserInputError(UserErrors.UserExists, {
          errorData: {
            username: UserErrors.UsernameExist,
          },
        })
      user.username = username
    }
    if (email) {
      if (await User.findOneBy({ email, id: Not(user.id) }))
        throw new UserInputError(UserErrors.UserExists, {
          errorData: {
            email: UserErrors.EmailExist,
          },
        })
      user.email = email
    }
    if (password) user.password = password
    return await user.save()
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteSelf(@Ctx() { user }: ApolloContext<Context>) {
    if (!user) throw new UserInputError(UserErrors.NotFound)
    await Promise.all(user.posts.map(post => post.remove()))
    await user.remove()
    return true
  }
}
