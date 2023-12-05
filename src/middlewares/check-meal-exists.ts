import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function checkMealExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const RequestParams = z.object({ mealId: z.string().uuid() })
  const { mealId } = RequestParams.parse(request.params)

  const meal = await knex('meals').select().where('id', mealId).first()

  if (!meal) {
    return reply.status(400).send('Usuario não encontrado no Banco de dados')
  }
}
