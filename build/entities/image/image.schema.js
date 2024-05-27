"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const imageSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    url: joi_1.default.string(),
    type: joi_1.default.string().valid('bookmark', 'user', 'folder').insensitive().required(), user: joi_1.default.object().keys({
        id: joi_1.default.number().required(),
        username: joi_1.default.string().required(),
        email: joi_1.default.string().required(),
        iat: joi_1.default.number(),
    }),
});
exports.default = imageSchema;
