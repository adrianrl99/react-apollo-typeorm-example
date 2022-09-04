import { Context as ApolloContext, UserInputError } from 'apollo-server-core'
import { validate } from 'class-validator'
import jwt from 'jsonwebtoken'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Not } from 'typeorm'

import type { Context } from '../..//types'
import Config from '../../Config'
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
  UserRole,
} from '.'

@Resolver(() => User)
export class UserResolver {
  @Authorized(UserRole.ADMIN)
  @Query(() => [User])
  async users() {
    return User.find()
  }

  @Authorized(UserRole.ADMIN)
  @Query(() => User)
  async user(@Arg('data') { email, id, username }: GetUserInput) {
    const user = await User.findOne({
      where: [{ id }, { username }, { email }],
    })
    if (!user) throw new UserInputError(UserErrors.NotFound)
    return user
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => User)
  async createUser(@Arg('data') data: CreateUserInput) {
    const userByUsername = await User.findOneBy({ username: data.username })
    const userByEmail = await User.findOneBy({ email: data.email })

    if (userByUsername || userByEmail)
      throw new UserInputError(UserErrors.UserExists, {
        errorData: {
          username: userByUsername ? UserErrors.UsernameExist : undefined,
          email: userByEmail ? UserErrors.EmailExist : undefined,
        },
      })

    const user = new User()
    Object.assign(user, data)
    const errors = await validate(user)
    if (errors.length)
      throw new UserInputError(UserErrors.InvalidFields, {
        errorData: Object.fromEntries(
          errors.map(v => [v.property, v.constraints]),
        ),
      })

    return user.save()
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => User)
  async updateUser(
    @Arg('data') { email, id, password, username }: UpdateUserInput,
  ) {
    const user = await User.findOneBy({ id })
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
    user.save()

    return { user, token }
  }

  @Mutation(() => SignUser)
  async signIn(@Arg('data') data: SignInUser) {
    const user = await User.findOneBy({
      username: data.username,
      password: data.password,
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
    user.save()

    return { user, token }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() { user }: ApolloContext<Context>) {
    if (!user) return false
    user.token = ''
    user.save()
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
  @Mutation(() => User)
  async deleteSelf(@Ctx() { user }: ApolloContext<Context>) {
    if (!user) throw new UserInputError(UserErrors.NotFound)
    await user.remove()
    return true
  }
}
