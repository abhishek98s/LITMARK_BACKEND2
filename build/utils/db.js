"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const knex_config_1 = __importDefault(require("../config/knex.config"));
function connection(tx) {
    return tx || knex_config_1.default;
}
exports.connection = connection;
