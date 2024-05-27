"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token)
            throw new Error('Access Denied');
        jsonwebtoken_1.default.verify(token.replace('Bearer ', ''), process.env.JWT_TOKEN, (err, decoded) => {
            if (err) {
                throw new Error('Unauthorized');
            }
            req.body.user = decoded;
            next();
        });
    }
    catch (error) {
        res.status(401).json({ msg: error.message });
    }
};
exports.verifyToken = verifyToken;
