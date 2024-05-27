"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const image_controller_1 = require("./image.controller");
const authentication_middleware_1 = require("../../auth/middleware/authentication.middleware");
const joiValidationMiddleware_1 = __importDefault(require("../../auth/middleware/joiValidationMiddleware"));
const image_schema_1 = __importDefault(require("./image.schema"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'temp/' });
router.use(authentication_middleware_1.verifyToken);
router.get('/:id', image_controller_1.getImage)
    .delete('/:id', image_controller_1.deleteImage)
    .patch('/:id', upload.single('litmark_image'), authentication_middleware_1.verifyToken, image_controller_1.patchImage);
router.post('/', upload.single('litmark_image'), (0, joiValidationMiddleware_1.default)(image_schema_1.default), authentication_middleware_1.verifyToken, image_controller_1.postImage);
exports.default = router;
