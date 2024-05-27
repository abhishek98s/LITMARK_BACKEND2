"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.fetchAll = exports.fetchById = void 0;
const knex_config_1 = __importDefault(require("../../config/knex.config"));
const fetchById = async (chipId) => {
    return await (0, knex_config_1.default)('chips').where('id', chipId).andWhere('isdeleted', false).first();
};
exports.fetchById = fetchById;
const fetchAll = async (user_id) => {
    return await (0, knex_config_1.default)('chips').where('user_id', user_id).andWhere('isdeleted', false);
};
exports.fetchAll = fetchAll;
const create = async (chipData) => {
    return await (0, knex_config_1.default)('chips').insert(chipData);
};
exports.create = create;
const update = async (chipData, chipId) => {
    return await (0, knex_config_1.default)('chips').where('id', chipId).update(chipData);
};
exports.update = update;
const remove = async (chipId) => {
    return await (0, knex_config_1.default)('chips').update('isdeleted', true).where('id', chipId);
};
exports.remove = remove;
