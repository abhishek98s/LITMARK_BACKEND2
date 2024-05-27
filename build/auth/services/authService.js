"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.findUserByEmail = void 0;
const knex_config_1 = __importDefault(require("../../config/knex.config"));
const user_service_1 = require("../../entities/user/user.service");
const findUserByEmail = async (email) => {
    const user = await (0, knex_config_1.default)('users').select('username', 'id', 'password', 'email').where('email', email).first();
    if (!user)
        throw new Error('User doesn\'t exist');
    return user;
};
exports.findUserByEmail = findUserByEmail;
const register = async (userData) => {
    return await (0, user_service_1.addUser)(userData);
};
exports.register = register;
