"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.table('bookmarks', function (t) {
        t.dateTime('click_date').nullable();
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('bookmarks');
}
exports.down = down;
