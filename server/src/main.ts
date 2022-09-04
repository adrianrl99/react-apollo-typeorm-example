import 'reflect-metadata'

import Config from './Config'
import database from './db'
import server from './server'

database({ name: Config.DATABASE }).then(() => server({ port: Config.PORT }))
