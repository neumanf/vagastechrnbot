import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('posts', table => {
        table.dropColumn('field');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('posts', table => {
        table.string('field').notNullable();
    })
}

