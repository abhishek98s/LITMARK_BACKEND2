"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    app: {
        name: process.env.NAME || 'LITMARK_BACKEND',
        port: process.env.SERVER_PORT || '5000',
    },
    database: getActiveDatabase(process.env.ACTIVE_DB || 'mysql2'),
};
function getActiveDatabase(db) {
    if (db === 'mysql2') {
        return {
            client: db,
            connection: {
                user: process.env.DB_MYSQL_USER,
                password: process.env.DB_MYSQL_PASSWORD,
                database: process.env.DB_NAME,
                host: process.env.DB_HOST || '127.0.0.1',
                port: parseInt(process.env.DB_PORT) || 3306,
            },
        };
    }
    else if (db === 'pg') {
        return {
            client: db,
            connection: {
                connectionString: 'ep-dawn-wind-42752734-pooler.us-east-1.aws.neon.tech',
                user: 'DB_USER',
                password: 'DB_PASSWORD',
                database: 'DB_NAME',
                host: 'DB_HOST',
                port: 'DB_PORT',
            },
        };
    }
}
