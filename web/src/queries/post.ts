import { gql } from '@apollo/client'

export const CORE_POST_FIELDS = gql`
  fragment CorePostFields on Post {
    id
    title
    body
    updatedAt
    user {
      id
      username
    }
    comments {
      id
    }
  }
`

export const COUNT_POSTS = gql`
  query CountPosts {
    countPosts
  }
`

export const GET_POSTS = gql`
  ${CORE_POST_FIELDS}
  query GetPosts($pagination: PaginationInput) {
    posts(pagination: $pagination) {
      ...CorePostFields
    }
  }
`

export const GET_POST = gql`
  ${CORE_POST_FIELDS}
  query GetPost($data: GetPostInput!) {
    post(data: $data) {
      ...CorePostFields
      comments {
        body
        updatedAt
        user {
          id
          username
        }
      }
    }
  }
`
