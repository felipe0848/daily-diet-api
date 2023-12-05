import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserExists } from '../middlewares/check-user-exists'

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

  app.get('/:userId', { preHandler: [checkUserExists] }, async (request) => {
    const getRequestParams = z.object({
      userId: z.string().uuid(),
    })
    const { userId } = getRequestParams.parse(request.params)

    const total = await knex('meals')
      .count({ value: 'id' })
      .where('user_id', userId)
      .first()

    const inDiet = await knex('meals')
      .count({ value: 'meal_in_diet' })
      .where({ user_id: userId, meal_in_diet: true })
      .first()

    const outDiet = await knex('meals')
      .count({ value: 'meal_in_diet' })
      .where({ user_id: userId, meal_in_diet: false })
      .first()

    const userStats = {
      total: total?.value,
      inDiet: inDiet?.value,
      outDiet: outDiet?.value,
    }

    return { userStats }
  })
}
