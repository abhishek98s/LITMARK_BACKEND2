"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortBy = exports.remove = exports.update = exports.create = exports.fetchAllByFolderId = exports.fetchById = exports.fetchAllNested = exports.fetchAllParent = void 0;
const knex_config_1 = __importDefault(require("../../config/knex.config"));
const fetchAllParent = async (user_id) => {
    return (0, knex_config_1.default)('folders').select('*').where('user_id', user_id).andWhere('folder_id', null).andWhere('isdeleted', false);
};
exports.fetchAllParent = fetchAllParent;
const fetchAllNested = async (user_id, parentFolderId) => {
    return await (0, knex_config_1.default)('folders').select('*').where('user_id', user_id).andWhere('folder_id', parentFolderId).andWhere('isdeleted', false);
};
exports.fetchAllNested = fetchAllNested;
const fetchById = async (folderId) => {
    return await (0, knex_config_1.default)('folders').select('*').where('id', folderId).andWhere('isdeleted', false).first();
};
exports.fetchById = fetchById;
const fetchAllByFolderId = async (folderId) => {
    return await (0, knex_config_1.default)('folders').where('folder_id ', folderId);
};
exports.fetchAllByFolderId = fetchAllByFolderId;
const create = async (folderData) => {
    return await (0, knex_config_1.default)('folders').insert(folderData);
};
exports.create = create;
const update = async (folderData, folderId) => {
    return await (0, knex_config_1.default)('folders').where('id', folderId).update(folderData);
};
exports.update = update;
const remove = async (folderId) => {
    return await (0, knex_config_1.default)('folders').where('id', folderId).update('isdeleted', true);
};
exports.remove = remove;
const sortBy = async (sortBy, userId, folderId, sortOrder) => {
    return await (0, knex_config_1.default)('folders').orderBy(sortBy, sortOrder).where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folderId);
};
exports.sortBy = sortBy;
