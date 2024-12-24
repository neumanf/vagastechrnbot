import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('posts', (table) => {
        table.renameColumn('name', 'title');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('posts', (table) => {
        table.renameColumn('title', 'name');
    })
}

