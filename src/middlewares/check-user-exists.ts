import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function checkUserExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const RequestParams = z.object({ userId: z.string().uuid() })
  const { userId } = RequestParams.parse(request.params)

  const user = await knex('users').select().where('id', userId).first()

  if (!user) {
    return reply.status(400).send('Usuario não encontrado no Banco de dados')
  }
}
