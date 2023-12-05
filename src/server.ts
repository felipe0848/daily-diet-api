import { app } from './app'

app.get('/', (request, reply) => {
  return reply.status(200).send('hello')
})

app.listen({ port: 3333 }, () => {
  console.log('listening on http://localhost:3333/')
})
