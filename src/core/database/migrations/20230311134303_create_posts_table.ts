import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('posts', (table) => {
        table.increments('id').primary();
        table.string('provider').notNullable();
        table.string('name').notNullable();
        table.string('company').nullable();
        table.string('field').notNullable();
        table.string('workType').nullable();
        table.string('salary').nullable();
        table.string('level').nullable();
        table.datetime('date').notNullable().defaultTo(knex.fn.now());
        table.string('url').unique().notNullable();

        table.index(['id'], 'id_UNIQUE');
        table.index(['date'], 'date_UNIQUE');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('posts');
}
