"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.fetchById = void 0;
const knex_config_1 = __importDefault(require("../../config/knex.config"));
const fetchById = async (imageId) => {
    return await (0, knex_config_1.default)('images').where('id', imageId).andWhere('isdeleted', false).first();
};
exports.fetchById = fetchById;
const create = async (imageData) => {
    return await (0, knex_config_1.default)('images').insert(imageData);
};
exports.create = create;
const update = async (imageData, imageId) => {
    return await (0, knex_config_1.default)('images').where('id', imageId).update(imageData);
};
exports.update = update;
const remove = async (imageId) => {
    return await (0, knex_config_1.default)('images').update('isdeleted', true).where('id', imageId);
};
exports.remove = remove;
