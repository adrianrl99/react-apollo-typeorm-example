import Config from '../src/Config'
import database from '../src/db'
import { Comment, Post, User, UserRole } from '../src/modules'

database({ name: Config.DATABASE }).then(async () => {
  const user = new User()
  user.username = 'admin'
  user.email = 'admin@mail.com'
  user.password = 'admin'
  user.role = UserRole.ADMIN
  await user.save()

  const post = new Post()
  post.title = 'Post title'
  post.body = 'Post body'
  post.user = user
  post.comments = []
  await post.save()

  const comment = new Comment()
  comment.title = 'Comment title'
  comment.body = 'Comment body'
  comment.user = user
  comment.post = post
  await comment.save()
})
