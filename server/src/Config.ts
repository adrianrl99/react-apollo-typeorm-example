const Config = {
  PORT: process.env.PORT,
  DATABASE: process.env.DATABASE || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
}

if (!Config.DATABASE) throw new Error('Missing environment variable "DATABASE"')
if (!Config.JWT_SECRET) throw new Error('Missing environment variable "JWT_SECRET"')

export default Config
