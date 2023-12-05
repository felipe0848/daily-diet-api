import fastify from 'fastify'
import { UsersRoute } from './routes/users'
import { MealsRoute } from './routes/meals'

export const app = fastify()

app.register(UsersRoute, {
  prefix: 'users',
})
app.register(MealsRoute, {
  prefix: 'meals',
})
