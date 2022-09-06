import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

import { KEY_TOKEN } from '~/hooks'

const httpLink = new HttpLink({ uri: import.meta.env.VITE_API })

const authLink = new ApolloLink((operation, forward) => {
  let token = localStorage.getItem(KEY_TOKEN)

  if (token) token = JSON.parse(token)

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
