import { Context as ApolloContext, UserInputError } from 'apollo-server-core'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { OnlyPostOwner } from '../../decorators'
import { Context } from '../../types'
import { UserErrors, UserRole } from '../user'
import {
  CreatePostInput,
  DeletePostInput,
  GetPostInput,
  Post,
  PostErrors,
  UpdatePostInput,
} from '.'

@Resolver(() => Post)
export class PostResolver {
  @Query(() => [Post])
  async posts() {
    return Post.find({ relations: { user: true, comments: true } })
  }

  @Query(() => Post)
  async post(@Arg('data') { id }: GetPostInput) {
    const post = await Post.findOne({
      where: { id },
      relations: { user: true, comments: true },
    })
    if (!post) throw new UserInputError(PostErrors.NotFound)
    return post
  }

  @Authorized()
  @Mutation(() => Post)
  async createPost(
    @Arg('data') { body, title }: CreatePostInput,
    @Ctx() { user }: ApolloContext<Context>,
  ) {
    if (!user) throw new UserInputError(UserErrors.NotFound)
    const post = new Post()
    post.title = title
    post.body = body
    post.user = user
    post.comments = []
    return await post.save()
  }

  @Authorized()
  @OnlyPostOwner(UserRole.ADMIN)
  @Mutation(() => Post)
  async updatePost(@Arg('data') { body, id, title }: UpdatePostInput) {
    const post = await Post.findOne({
      where: { id },
      relations: { user: true, comments: true },
    })
    if (!post) throw new UserInputError(PostErrors.NotFound)
    if (title) post.title = title
    if (body) post.body = body
    return await post.save()
  }

  @Authorized()
  @OnlyPostOwner(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deletePost(@Arg('data') { id }: DeletePostInput) {
    const post = await Post.findOneBy({ id })
    if (!post) throw new UserInputError(PostErrors.NotFound)
    await Promise.all(post.comments.map(comment => comment.remove()))
    await post.remove()
    return true
  }
}
