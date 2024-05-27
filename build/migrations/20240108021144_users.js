"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('email', 191).unique().notNullable();
        table.string('password').notNullable();
        table.string('role').notNullable();
        table.integer('image_id').notNullable();
        table.string('created_by').notNullable();
        table.string('updated_by').notNullable();
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTableIfExists('users');
}
exports.down = down;
