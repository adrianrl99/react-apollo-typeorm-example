import Config from '../src/Config'
import database from '../src/db'
import { User, UserRole } from '../src/modules'

database({ name: Config.DATABASE }).then(() => {
  const admin = new User()
  admin.username = 'admin'
  admin.email = 'admin@mail.com'
  admin.password = 'admin'
  admin.role = UserRole.ADMIN
  admin.save()
})
