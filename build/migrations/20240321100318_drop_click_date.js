"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.alterTable('bookmarks', function (table) {
        table.dropColumn('click_date');
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.alterTable('bookmarks', function (table) {
        table.date('click_date');
    });
}
exports.down = down;
