"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.fetchById = void 0;
const knex_config_1 = __importDefault(require("../../config/knex.config"));
const fetchById = async (userId) => {
    return await (0, knex_config_1.default)('users').select('*').where('id', userId).andWhere('isdeleted', false).first();
};
exports.fetchById = fetchById;
const create = async (userData) => {
    return await (0, knex_config_1.default)('users').insert(userData);
};
exports.create = create;
const update = async (userData, userId) => {
    return await (0, knex_config_1.default)('users').select('*').where('id', userId).update(userData);
};
exports.update = update;
const remove = async (userId) => {
    return await (0, knex_config_1.default)('users').where('id', userId).update('isdeleted', true);
};
exports.remove = remove;
