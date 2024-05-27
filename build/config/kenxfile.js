"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knexConfig = void 0;
const config_1 = require("./config");
exports.knexConfig = {
    ...config_1.config.database,
    migrations: {
        tableName: 'migrations',
        directory: '../migrations',
        extensions: ['ts']
    }
};
module.exports = exports.knexConfig;
