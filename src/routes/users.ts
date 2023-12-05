import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function UsersRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const CreateUserRequestBody = z.object({
      name: z.string(),
    })

    const body = CreateUserRequestBody.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name: body.name,
    })

    return reply.status(201).send(`Create new user!`)
  })

  app.get('/', async () => {
    const users = await knex('users').select()
    return { users }
  })
}
