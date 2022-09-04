import * as path from 'path'
import { DataSource } from 'typeorm'

import { Comment, Post, User } from './modules'

export interface DatabaseOptions {
  name: string
}

export default async function database(options: DatabaseOptions) {
  return await new DataSource({
    type: 'sqlite',
    database: path.join('database', options.name),
    synchronize: true,
    logging: true,
    entities: [User, Post, Comment],
  })
    .initialize()
    .then(database => {
      console.log('Database initialized')
      return database
    })
}
