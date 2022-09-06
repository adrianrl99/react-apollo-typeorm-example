import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import jwt from 'jsonwebtoken'
import * as path from 'path'
import { AuthChecker, buildSchema } from 'type-graphql'

import Config from './Config'
import { CommentResolver, PostResolver, User, UserResolver } from './modules'
import type { Context } from './types'

export interface ServerOptions {
  port?: string | number
}

const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) =>
  !!user && (!roles.length || roles.includes(user.role))

export default async function server(options: ServerOptions) {
  return await new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, CommentResolver],
      emitSchemaFile: path.join('graphql', 'schema.gql'),
      authChecker,
    }),
    csrfPrevention: true,
    cache: 'bounded',
    cors: {
      origin: ['http://localhost:4001'],
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    async context({ req }) {
      const token = (req.headers.authorization || '').replace('Bearer ', '')

      if (token) {
        const payload = jwt.verify(token, Config.JWT_SECRET)
        if (typeof payload !== 'string') {
          const user = await User.findOne({
            where: { id: payload.id },
            relations: { posts: true, comments: true },
          })
          if (user && user.token === token) return { user }
        }
      }

      return {}
    },
  })
    .listen(options.port)
    .then(server => {
      console.log(`Server ready at ${server.url}`)
      return server
    })
}
