/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios'
import {
  CommentInterface,
  PostInterface,
  UserInterface,
  UserRole,
} from 'shared'

import Config from '../src/Config'
import database from '../src/db'
import { Comment, Post, User } from '../src/modules'

const DATASETS = {
  USERS:
    'https://s3.amazonaws.com/mockaroo.files.production/downloads/131358/blog-example-user.json?AWSAccessKeyId=AKIAI7XQ7X4Y4LZEAXQQ&Expires=1662441882&Signature=VBacB1fRw9k3B3hlhjkKk3wKN%2BQ%3D&response-content-disposition=attachment%3B%20filename%3Dblog-example-user.json',
  POSTS:
    'https://s3.amazonaws.com/mockaroo.files.production/downloads/131359/blog-example-post.json?AWSAccessKeyId=AKIAI7XQ7X4Y4LZEAXQQ&Expires=1662441882&Signature=%2BTHDnFqgpKbf%2BnROd%2B%2BwTpSXOXg%3D&response-content-disposition=attachment%3B%20filename%3Dblog-example-post.json',
  COMMENTS:
    'https://s3.amazonaws.com/mockaroo.files.production/downloads/131367/blog-example-comment.json?AWSAccessKeyId=AKIAI7XQ7X4Y4LZEAXQQ&Expires=1662447972&Signature=lfTU%2Bcw8VZ842avHBDwxpa5qCrU%3D&response-content-disposition=attachment%3B%20filename%3Dblog-example-comment.json',
}

database({ name: Config.DATABASE }).then(async () => {
  User.clear()

  const user = new User()
  user.username = 'admin'
  user.email = 'admin@mail.com'
  user.password = 'admin'
  user.role = UserRole.ADMIN
  await user.save()

  const users = await axios.get<UserInterface[]>(DATASETS.USERS)
  for await (const u of users.data) {
    const user = new User()
    Object.assign(user, u)

    await user.save()
  }

  Post.clear()
  const posts = await axios.get<PostInterface[]>(DATASETS.POSTS)
  for await (const { user: u, ...p } of posts.data) {
    const post = new Post()
    Object.assign(post, p)

    const user = await User.findOneBy({ username: u as any as string })
    if (user) post.user = user

    await post.save()
  }

  Comment.clear()
  const comments = await axios.get<CommentInterface[]>(DATASETS.COMMENTS)
  for await (const { post: p, user: u, ...c } of comments.data) {
    const comment = new Comment()
    Object.assign(comment, c)

    const user = await User.findOneBy({ username: u as any as string })
    if (user) comment.user = user
    const post = await Post.findOneBy({ title: p as any as string })

    if (post) comment.post = post

    await comment.save()
  }
})
