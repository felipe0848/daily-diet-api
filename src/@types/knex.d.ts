// eslint-disable-next-line @typescript-eslint/no-unused-vars
import knex from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      created_at: string
    }
    meals: {
      id: string
      meal_name: string
      description: string
      meal_in_diet: boolean
      created_at: string
      user_id: string
    }
  }
}
