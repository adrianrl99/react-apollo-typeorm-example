import { gql } from '@apollo/client'

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    id
    username
    email
    role
    updatedAt
  }
`

export const GET_SELF = gql`
  ${CORE_USER_FIELDS}
  query GetSelf {
    getSelf {
      ...CoreUserFields
    }
  }
`

export const SIGN_IN = gql`
  ${CORE_USER_FIELDS}
  mutation SignIn($data: SignInUser!) {
    signIn(data: $data) {
      token
      user {
        ...CoreUserFields
      }
    }
  }
`

export const SIGN_UP = gql`
  ${CORE_USER_FIELDS}
  mutation SignUp($data: SignUpUser!) {
    signUp(data: $data) {
      token
      user {
        ...CoreUserFields
      }
    }
  }
`

export const LOG_OUT = gql`
  mutation LogGout {
    logout
  }
`
