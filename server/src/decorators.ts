import { ForbiddenError } from 'apollo-server-core'
import type { UserRole } from 'shared'
import { createMethodDecorator } from 'type-graphql'

import { CommentErrors, PostErrors } from './modules'
import { Context } from './types'

export function OnlyPostOwner(...roles: UserRole[]) {
  return createMethodDecorator<Context>(async ({ args, context: { user } }, next) => {
    const id = args?.data?.id

    if (id && user && (roles.includes(user.role) || user.posts.find(post => post.id === id))) {
      return next()
    }

    throw new ForbiddenError(PostErrors.NotOwner)
  })
}

export function OnlyCommentOwner(...roles: UserRole[]) {
  return createMethodDecorator<Context>(async ({ args, context: { user } }, next) => {
    const id = args?.data?.id

    if (id && user && (roles.includes(user.role) || user.comments.find(comment => comment.id === id))) {
      return next()
    }

    throw new ForbiddenError(CommentErrors.NotOwner)
  })
}
