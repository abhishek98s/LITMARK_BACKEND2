"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandler = exports.loginHandler = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const authService_1 = require("../services/authService");
const image_controller_1 = require("../../entities/image/image.controller");
const image_service_1 = require("../../entities/image/image.service");
const authExceptionMessages_1 = require("../constant/authExceptionMessages");
const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error(authExceptionMessages_1.authExceptionMessages.EMAIL_PASS_REQUIRED);
        }
        const user = await (0, authService_1.findUserByEmail)(email);
        const { username, id, email: dBEmail } = user;
        const passordMatched = await bcrypt_1.default.compare(password, user.password);
        if (!passordMatched) {
            throw new Error(authExceptionMessages_1.authExceptionMessages.INVALID_ID_CREDENTIALS);
        }
        const token = jsonwebtoken_1.default.sign({ username, id, email: dBEmail }, process.env.JWT_TOKEN);
        res.status(200).json({ data: token });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.loginHandler = loginHandler;
const registerHandler = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            throw new Error(authExceptionMessages_1.authExceptionMessages.USER_CREDENTIALS);
        }
        if (!(validator_1.default.isEmail(email))) {
            throw new Error(authExceptionMessages_1.authExceptionMessages.INVALID_EMAIL);
        }
        if (!(validator_1.default.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }))) {
            throw new Error(authExceptionMessages_1.authExceptionMessages.PASS_VALIDATION);
        }
        if (!role) {
            req.body.role = 'normal';
        }
        if (req.file) {
            const imagePath = req.file.path;
            const imageUrl = await (0, image_controller_1.uploadImage)(imagePath);
            const imageName = req.file.filename;
            const image = await (0, image_service_1.saveImage)({ url: imageUrl, type: 'user', name: imageName, isdeleted: false }, username);
            req.body.image_id = image.id;
        }
        else {
            req.body.image_id = 0;
        }
        const savedUser = await (0, authService_1.register)({
            username,
            email,
            password,
            role: req.body.role,
            isdeleted: false,
            image_id: req.body.image_id,
            created_by: username,
            updated_by: username,
        });
        res.json({ data: savedUser });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.registerHandler = registerHandler;
