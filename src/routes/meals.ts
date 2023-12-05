import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkUserExists } from '../middlewares/check-user-exists'
import { checkMealExists } from '../middlewares/check-meal-exists'

export async function MealsRoute(app: FastifyInstance) {
  app.get('/', { preHandler: [checkUserExists] }, async (request, reply) => {
    const GetMealsRequestParams = z.object({ userId: z.string().uuid() })
    const { userId } = GetMealsRequestParams.parse(request.params)

    const meals = await knex('meals').select().where('user_id', userId)

    return { meals }
  })

  app.post('/', { preHandler: [checkUserExists] }, async (request, reply) => {
    const CreateMealRequestParams = z.object({ userId: z.string().uuid() })
    const { userId } = CreateMealRequestParams.parse(request.params)

    const CreateMealRequestBody = z.object({
      name: z.string(),
      description: z.string(),
      ateAt: z.string().datetime(),
      inDiet: z.boolean(),
    })

    const { name, ateAt, description, inDiet } = CreateMealRequestBody.parse(
      request.body,
    )

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

  app.put(
    '/:mealId',
    { preHandler: [checkUserExists, checkMealExists] },
    async (request, reply) => {
      const PutMealRequestParams = z.object({
        userId: z.string().uuid(),
        mealId: z.string().uuid(),
      })
      const { userId, mealId } = PutMealRequestParams.parse(request.params)

      const PutMealRequestBody = z
        .object({
          name: z.string(),
          description: z.string(),
          ateAt: z.string().datetime(),
          inDiet: z.boolean(),
        })
        .partial()

      const { name, ateAt, description, inDiet } = PutMealRequestBody.parse(
        request.body,
      )

      const meal = await knex('meals')
        .select()
        .where({ id: mealId, user_id: userId })
        .first()

      if (!meal) {
        return reply.status(404).send('Refeição não encontrada')
      }

      const updatedMeal = {
        id: meal.id,
        meal_name: name || meal.meal_name,
        description: description || meal.description,
        meal_in_diet: inDiet !== undefined ? inDiet : meal.meal_in_diet,
        created_at: ateAt || meal.created_at,
        user_id: meal.user_id,
      }

      await knex('meals')
        .update(updatedMeal)
        .where({ id: mealId, user_id: userId })

      return reply.status(200).send()
    },
  )
}
