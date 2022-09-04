import fs from 'node:fs'

import newman from 'newman'
import * as path from 'path'

import collection from '../docs/postman_collection.json'
import database from '../src/db'
import server from '../src/server'

const DATABASE = 'test.sqlite'
const PORT = '4002'

database({
  name: DATABASE,
}).then(() => {
  server({ port: PORT }).then(server => {
    newman.run(
      {
        collection,
        reporters: 'cli',
        envVar: [
          {
            key: 'url',
            value: server.url,
          },
        ],
      },
      function (err) {
        if (err) throw err

        fs.rmSync(path.join('database', DATABASE))
      },
    )
  })
})
