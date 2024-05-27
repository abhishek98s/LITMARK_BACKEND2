"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('bookmarks', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('url').notNullable();
        table.date('date').notNullable();
        table.integer('image_id').unsigned().notNullable();
        table.foreign('image_id').references('images.id');
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id');
        table.integer('folder_id').unsigned().notNullable();
        table.foreign('folder_id').references('folders.id');
        table.integer('chip_id').unsigned().notNullable();
        table.foreign('chip_id').references('chips.id');
        table.string('created_by').notNullable();
        table.string('updated_by').notNullable();
        table.date('click_date');
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTableIfExists('bookmarks');
}
exports.down = down;
