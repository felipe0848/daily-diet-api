import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')

    await request(app.server)
      .post('/users')
      .send({ name: 'John Doe' })
      .expect(201)
  })

  it('should be able to create a new meal', async () => {
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
  })

  it('should be able to list all meals of one user', async () => {
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

    const listMealsResponse = await request(app.server)
      .get(`/users/${user.id}/meals`)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        meal_name: 'x-bacon',
        description: 'describe meals lorem ipsum dolor sit',
        meal_in_diet: 0,
      }),
    ])
  })

  it('should be able to list one meal of one user', async () => {
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

    const listMealsResponse = await request(app.server)
      .get(`/users/${user.id}/meals`)
      .expect(200)
    const meal = listMealsResponse.body.meals[0]

    const listMealResponse = await request(app.server)
      .get(`/users/${user.id}/meals/${meal.id}`)
      .expect(200)

    expect(listMealResponse.body).toEqual({ meal })
  })

  it('should be able to delete a meal', async () => {
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

    const listMealsResponse = await request(app.server)
      .get(`/users/${user.id}/meals`)
      .expect(200)
    const meal = listMealsResponse.body.meals[0]

    await request(app.server)
      .delete(`/users/${user.id}/meals/${meal.id}`)
      .expect(204)
  })

  it('should be able to update a meal', async () => {
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

    const listMealsResponse = await request(app.server)
      .get(`/users/${user.id}/meals`)
      .expect(200)
    const meal = listMealsResponse.body.meals[0]

    await request(app.server)
      .put(`/users/${user.id}/meals/${meal.id}`)
      .send({
        name: 'brocolis',
        description: 'describe meals lorem ipsum dolor sit',
        ateAt: new Date().toISOString(),
        inDiet: true,
      })
      .expect(204)

    const mealUpdatedResponse = await request(app.server)
      .get(`/users/${user.id}/meals/${meal.id}`)
      .expect(200)

    expect(mealUpdatedResponse.body.meal).toEqual(
      expect.objectContaining({
        meal_name: 'brocolis',
        description: 'describe meals lorem ipsum dolor sit',
        meal_in_diet: 1,
      }),
    )
  })
})
