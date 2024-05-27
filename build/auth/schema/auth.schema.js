"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const authSchema = {
    login: joi_1.default.object().keys({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
    register: joi_1.default.object().keys({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().min(8).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)).required(),
        email: joi_1.default.string().email().required(),
    }),
};
exports.default = authSchema;
