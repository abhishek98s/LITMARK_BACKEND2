import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('chips', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();

        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id');

        table.integer('folder_id').unsigned().notNullable();
        table.foreign('folder_id').references('folders.id');

        table.string('created_by').notNullable();
        table.string('updated_by').notNullable();

        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('chips');
}
