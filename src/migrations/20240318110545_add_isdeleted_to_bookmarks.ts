import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('bookmarks', function (table) {
        table.boolean('isdeleted').notNullable().defaultTo(false);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('bookmarks', function (table) {
        table.dropColumn('isdeleted');
    });
}

