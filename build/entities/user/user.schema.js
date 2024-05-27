"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userSchema = joi_1.default.object().keys({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)).required(),
    image_id: joi_1.default.number(),
    role: joi_1.default.string().valid('normal', 'admin'), user: joi_1.default.object().keys({
        id: joi_1.default.number().required(),
        username: joi_1.default.string().required(),
        email: joi_1.default.string().required(),
        iat: joi_1.default.number(),
    }),
});
exports.default = userSchema;
