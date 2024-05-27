"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const user_controller_1 = require("./user.controller");
const authentication_middleware_1 = require("../../auth/middleware/authentication.middleware");
const joiValidationMiddleware_1 = __importDefault(require("../../auth/middleware/joiValidationMiddleware"));
const user_schema_1 = __importDefault(require("./user.schema"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'temp/' });
router.use(authentication_middleware_1.verifyToken);
router.get('/:id', user_controller_1.getUser)
    .patch('/:id', upload.single('litmark_image'), user_controller_1.patchUser)
    .delete('/:id', user_controller_1.deleteUser);
router.post('/', upload.single('litmark_image'), (0, joiValidationMiddleware_1.default)(user_schema_1.default), user_controller_1.postUser);
exports.default = router;
