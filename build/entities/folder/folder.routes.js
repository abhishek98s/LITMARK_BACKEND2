"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folder_controller_1 = require("./folder.controller");
const authentication_middleware_1 = require("../../auth/middleware/authentication.middleware");
const multer_1 = __importDefault(require("multer"));
const joiValidationMiddleware_1 = __importDefault(require("../../auth/middleware/joiValidationMiddleware"));
const folder_schema_1 = __importDefault(require("./folder.schema"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'temp/' });
router.use(authentication_middleware_1.verifyToken);
router.get('/sort', folder_controller_1.getSortedFolders);
router.get('/', folder_controller_1.getAllTopFolders).get('/:id', folder_controller_1.getAllnestedFolders).post('/', (0, joiValidationMiddleware_1.default)(folder_schema_1.default), authentication_middleware_1.verifyToken, folder_controller_1.postFolders);
router.patch('/:id', upload.single('litmark_image'), authentication_middleware_1.verifyToken, folder_controller_1.patchFolders).delete('/:id', folder_controller_1.deleteFolders);
exports.default = router;
