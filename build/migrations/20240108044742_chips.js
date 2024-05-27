"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
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
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTableIfExists('chips');
}
exports.down = down;
