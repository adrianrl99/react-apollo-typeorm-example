/* eslint-disable no-use-before-define */

export interface EntityInterface {
  createdAt: string
  id: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'admin',
  GUEST = 'guest',
}

export interface UserInterface extends EntityInterface {
  comments: CommentInterface[]
  email: string
  password: string
  posts: PostInterface[]
  role: UserRole
  token: string
  username: string
}

export interface PostInterface extends EntityInterface {
  body: string
  comments: CommentInterface[]
  title: string
  user: UserInterface
}

export interface CommentInterface extends EntityInterface {
  body: string
  post: PostInterface
  user: UserInterface
}

export interface SignUserInterface {
  token: string
  user: UserInterface
}

export interface DataInterface {
  countPosts?: number
  getSelf?: UserInterface
  logout?: boolean
  post?: PostInterface
  posts?: PostInterface[]
  signIn?: SignUserInterface
  signUp?: SignUserInterface
}

export interface SignInUserInterface {
  password: string
  username: string
}

export interface SignUpUserInterface {
  email: string
  password: string
  username: string
}

export interface PaginationInputInterface {
  limit?: number
  offset?: number
}

export interface FilterUserByInputInterface {
  email?: string
  id?: string
  username?: string
}

export interface FilterPostByInputInterface {
  id?: string
  user?: FilterUserByInputInterface
}

export interface OperationVariablesInterface {
  data?: DataInterface
  pagination?: PaginationInputInterface
}
