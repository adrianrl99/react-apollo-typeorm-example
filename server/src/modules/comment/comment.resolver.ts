import { Context as ApolloContext, UserInputError } from 'apollo-server-core'
import { UserRole } from 'shared'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { OnlyCommentOwner } from '../../decorators'
import { Context } from '../../types'
import { Post, PostErrors } from '../post'
import { UserErrors } from '../user'
import {
  Comment,
  CommentErrors,
  CreateCommentInput,
  DeleteCommentInput,
  GetCommentInput,
  UpdateCommentInput,
} from '.'

@Resolver(() => Comment)
export class CommentResolver {
  @Query(() => [Comment])
  async comments() {
    return Comment.find({ relations: { user: true, post: true } })
  }

  @Query(() => Comment)
  async comment(@Arg('data') { id }: GetCommentInput) {
    const comment = await Comment.findOne({
      where: { id },
      relations: { user: true, post: true },
    })
    if (!comment) throw new UserInputError(CommentErrors.NotFound)
    return comment
  }

  @Authorized()
  @Mutation(() => Comment)
  async createComment(
    @Arg('data') { body, postId }: CreateCommentInput,
    @Ctx() { user }: ApolloContext<Context>,
  ) {
    if (!user) throw new UserInputError(UserErrors.NotFound)
    const post = await Post.findOne({
      where: { id: postId },
      relations: { user: true, comments: true },
    })
    if (!post) throw new UserInputError(PostErrors.NotFound)
    const comment = new Comment()
    comment.body = body
    comment.user = user
    comment.post = post
    return await comment.save()
  }

  @Authorized()
  @OnlyCommentOwner(UserRole.ADMIN)
  @Mutation(() => Comment)
  async updateComment(@Arg('data') { body, id }: UpdateCommentInput) {
    const comment = await Comment.findOne({
      where: { id },
      relations: { user: true, post: true },
    })
    if (!comment) throw new UserInputError(CommentErrors.NotFound)
    if (body) comment.body = body
    return await comment.save()
  }

  @Authorized()
  @OnlyCommentOwner(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteComment(@Arg('data') { id }: DeleteCommentInput) {
    const comment = await Comment.findOneBy({ id })
    if (!comment) throw new UserInputError(CommentErrors.NotFound)
    await comment.remove()
    return true
  }
}
