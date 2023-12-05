import fastify from 'fastify'
import { UsersRoute } from './routes/users'

export const app = fastify()

app.register(UsersRoute, {
  prefix: 'users',
})
