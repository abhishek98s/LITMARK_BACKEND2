import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('bookmarks', function (t) {
        t.dateTime('click_date').nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('bookmarks');
}
