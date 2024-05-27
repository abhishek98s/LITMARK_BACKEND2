"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRecentlyClickedBookmarksByTittle = exports.filterRecentlyClickedBookmarksByChip = exports.sortRecentlyClickedBookmarkBy = exports.removeRecentlyClickedBookmark = exports.updateClickedDate = exports.sortBy = exports.fetchByTitle = exports.removeByFolderid = exports.remove = exports.updateTitle = exports.create = exports.fetchByFolderId = exports.fetchAll = exports.fetchById = void 0;
const knex_config_1 = __importDefault(require("../../config/knex.config"));
const fetchById = async (bookmarkId) => {
    return await (0, knex_config_1.default)('bookmarks').select('*').where('id', bookmarkId).andWhere('isdeleted', false).first();
};
exports.fetchById = fetchById;
const fetchAll = async (user_id) => {
    return await (0, knex_config_1.default)('bookmarks').select('*').where('user_id', user_id).andWhere('isdeleted', false);
};
exports.fetchAll = fetchAll;
const fetchByFolderId = async (user_id, folder_id) => {
    return await (0, knex_config_1.default)('bookmarks').select('*').where('user_id', user_id).andWhere('folder_id', folder_id).andWhere('isdeleted', false);
};
exports.fetchByFolderId = fetchByFolderId;
const create = async (bookmarkData) => {
    return await (0, knex_config_1.default)('bookmarks').insert(bookmarkData);
};
exports.create = create;
const updateTitle = async (bookmarkData, bookmarkId) => {
    return await (0, knex_config_1.default)('bookmarks').where('id', bookmarkId).update(bookmarkData);
};
exports.updateTitle = updateTitle;
const remove = async (bookmarkData) => {
    return await (0, knex_config_1.default)('bookmarks').where('id', bookmarkData.id).update(bookmarkData);
};
exports.remove = remove;
const removeByFolderid = async (folderId) => {
    return await (0, knex_config_1.default)('bookmarks').where('folder_id', folderId).update('isdeleted', true);
};
exports.removeByFolderid = removeByFolderid;
const fetchByTitle = async (title, folderId) => {
    return await (0, knex_config_1.default)('bookmarks').select('title', 'url').whereRaw('LOWER(title) LIKE LOWER(?)', [`%${title}%`]).andWhere('isdeleted', false).andWhere('folder_id', folderId);
};
exports.fetchByTitle = fetchByTitle;
const sortBy = async (sortBy, userId, folder_id, sortOrder) => {
    return await (0, knex_config_1.default)('bookmarks').where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folder_id).orderBy(sortBy, sortOrder);
};
exports.sortBy = sortBy;
const updateClickedDate = async (bookmarkData) => {
    return await (0, knex_config_1.default)('bookmarks').update(bookmarkData).where('id', bookmarkData.id);
};
exports.updateClickedDate = updateClickedDate;
const removeRecentlyClickedBookmark = async (bookmarkData, user_id) => {
    return await (0, knex_config_1.default)('bookmarks').update(bookmarkData).where('user_id', user_id).andWhere('id', bookmarkData.id);
};
exports.removeRecentlyClickedBookmark = removeRecentlyClickedBookmark;
const sortRecentlyClickedBookmarkBy = async (sortBy, userId, sortOrder) => {
    return await (0, knex_config_1.default)('bookmarks').where('user_id', userId).andWhere('isdeleted', false).andWhereNot('click_date', null).orderBy(sortBy, sortOrder);
};
exports.sortRecentlyClickedBookmarkBy = sortRecentlyClickedBookmarkBy;
const filterRecentlyClickedBookmarksByChip = async (userId, chipId) => {
    return await (0, knex_config_1.default)('bookmarks').where('user_id', userId).where('chip_id', chipId).andWhere('isdeleted', false).andWhereNot('click_date', null);
};
exports.filterRecentlyClickedBookmarksByChip = filterRecentlyClickedBookmarksByChip;
const fetchRecentlyClickedBookmarksByTittle = async (title) => {
    return await (0, knex_config_1.default)('bookmarks').select('title', 'url').whereRaw('LOWER(title) LIKE LOWER(?)', [`%${title}%`]).andWhere('isdeleted', false).andWhereNot('click_date', null);
};
exports.fetchRecentlyClickedBookmarksByTittle = fetchRecentlyClickedBookmarksByTittle;
