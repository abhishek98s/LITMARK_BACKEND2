import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('bookmarks', function (table) {
        table.dropColumn('click_date');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('bookmarks', function (table) {
        table.date('click_date');
    });
}
