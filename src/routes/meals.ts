import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkUserExists } from '../middlewares/check-user-exists'

export async function MealsRoute(app: FastifyInstance) {
  app.post('/', { preHandler: [checkUserExists] }, async (request, reply) => {
    const CreateMealRequestBody = z.object({
      name: z.string(),
      description: z.string(),
      ateAt: z.string().datetime(),
      inDiet: z.boolean(),
      userId: z.string().uuid(),
    })

    const { name, ateAt, description, inDiet, userId } =
      CreateMealRequestBody.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      meal_name: name,
      description,
      meal_in_diet: inDiet,
      created_at: ateAt,
      user_id: userId,
    })

    return reply.status(201).send('refeição adicionada com sucesso')
  })
}
