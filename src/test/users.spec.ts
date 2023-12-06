import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { execSync } from 'node:child_process'

describe('Users Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({ name: 'John Doe' })
      .expect(201)
  })
  it('should be able list all users', async () => {
    await request(app.server)
      .post('/users')
      .send({ name: 'John Doe' })
      .expect(201)

    const listUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    expect(listUsersResponse.body.users).toEqual([
      expect.objectContaining({ name: 'John Doe' }),
    ])
  })
  it('should be able get summary with total, in diet, out diet meals', async () => {
    await request(app.server)
      .post('/users')
      .send({ name: 'John Doe' })
      .expect(201)

    const listUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)
    const user = listUsersResponse.body.users[0]

    await request(app.server)
      .post(`/users/${user.id}/meals`)
      .send({
        name: 'x-bacon',
        description: 'describe meals lorem ipsum dolor sit',
        ateAt: new Date().toISOString(),
        inDiet: false,
      })
      .expect(201)

    await request(app.server)
      .post(`/users/${user.id}/meals`)
      .send({
        name: 'brocolis',
        description: 'describe meals lorem ipsum dolor sit',
        ateAt: new Date().toISOString(),
        inDiet: true,
      })
      .expect(201)

    const summaryUserResponse = await request(app.server)
      .get(`/users/${user.id}`)
      .expect(200)

    expect(summaryUserResponse.body.userStats).toEqual({
      total: 2,
      inDiet: 1,
      outDiet: 1,
    })
  })
})
