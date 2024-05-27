"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.table('users', function (table) {
        table.boolean('isdeleted').notNullable().defaultTo(false);
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.table('users', function (table) {
        table.dropColumn('isdeleted');
    });
}
exports.down = down;
