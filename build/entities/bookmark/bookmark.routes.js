"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const bookmark_controller_1 = require("./bookmark.controller");
const authentication_middleware_1 = require("../../auth/middleware/authentication.middleware");
const joiValidationMiddleware_1 = __importDefault(require("../../auth/middleware/joiValidationMiddleware"));
const bookmark_schema_1 = __importDefault(require("./bookmark.schema"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'temp/' });
router.use(authentication_middleware_1.verifyToken);
router.get('/recent', bookmark_controller_1.getRecentBookmarks)
    .delete('/recent/:id', bookmark_controller_1.deleteRecentBookmark)
    .patch('/recent/:id', bookmark_controller_1.addRecentBookmark)
    .patch('/recent/:id', bookmark_controller_1.addRecentBookmark)
    .get('/recent/sort', bookmark_controller_1.sortRecentBookmark)
    .get('/recent/filter', bookmark_controller_1.filterRecentBookmark)
    .get('/recent/search', bookmark_controller_1.searchRecentBookmark);
router.get('/search', bookmark_controller_1.searchByTitle);
router.get('/sort', bookmark_controller_1.getSortedData);
router.get('/', bookmark_controller_1.getBookmarks)
    .get('/:folder_id', bookmark_controller_1.getBookmarksByFolderId)
    .post('/', (0, joiValidationMiddleware_1.default)(bookmark_schema_1.default), authentication_middleware_1.verifyToken, bookmark_controller_1.postBookmark);
router.patch('/:id', upload.single('litmark_image'), authentication_middleware_1.verifyToken, bookmark_controller_1.patchBookmark)
    .delete('/:id', bookmark_controller_1.deleteBookmark);
exports.default = router;
