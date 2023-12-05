import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.string('meal_name').notNullable()
    table.string('description')
    table.boolean('meal_in_diet').notNullable()
    table.string('created_at').defaultTo(knex.fn.now()).notNullable()
    table.uuid('user_id').unsigned().index()
    table.foreign('user_id').references('users.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
