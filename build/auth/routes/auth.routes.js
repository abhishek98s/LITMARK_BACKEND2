"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const authController_1 = require("../controllers/authController");
const joiValidationMiddleware_1 = __importDefault(require("../middleware/joiValidationMiddleware"));
const auth_schema_1 = __importDefault(require("../schema/auth.schema"));
const upload = (0, multer_1.default)({ dest: 'temp/' });
router.post('/register', upload.single('litmark_image'), (0, joiValidationMiddleware_1.default)(auth_schema_1.default.register), authController_1.registerHandler);
router.post('/login', (0, joiValidationMiddleware_1.default)(auth_schema_1.default.login), authController_1.loginHandler);
exports.default = router;
