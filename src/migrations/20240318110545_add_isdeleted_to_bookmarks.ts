import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('bookmarks', function (table) {
    table.boolean('isdeleted').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  const exits = await knex.schema.hasTable('bookmarks');

  if (exits) {
    await knex.schema.table('bookmarks', function (table) {
      table.dropColumn('isdeleted');
    });
  }
}
