"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('images', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('url').notNullable();
        table.string('type').notNullable();
        table.string('created_by').notNullable();
        table.string('updated_by').notNullable();
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTableIfExists('images');
}
exports.down = down;
