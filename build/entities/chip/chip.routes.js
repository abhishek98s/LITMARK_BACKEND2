"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chip_controller_1 = require("./chip.controller");
const authentication_middleware_1 = require("../../auth/middleware/authentication.middleware");
const joiValidationMiddleware_1 = __importDefault(require("../../auth/middleware/joiValidationMiddleware"));
const chip_schema_1 = __importDefault(require("./chip.schema"));
const router = express_1.default.Router();
router.use(authentication_middleware_1.verifyToken);
router.get('/', chip_controller_1.getAllChips)
    .post('/', (0, joiValidationMiddleware_1.default)(chip_schema_1.default), chip_controller_1.postChip)
    .patch('/:id', chip_controller_1.patchChip)
    .delete('/:id', chip_controller_1.deleteChip);
exports.default = router;
