"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const swagger_1 = require("./swagger/swagger");
const logger_1 = require("./logger/logger");
const image_routes_1 = __importDefault(require("./entities/image/image.routes"));
const user_routes_1 = __importDefault(require("./entities/user/user.routes"));
const chip_routes_1 = __importDefault(require("./entities/chip/chip.routes"));
const folder_routes_1 = __importDefault(require("./entities/folder/folder.routes"));
const bookmark_routes_1 = __importDefault(require("./entities/bookmark/bookmark.routes"));
const auth_routes_1 = __importDefault(require("./auth/routes/auth.routes"));
const app = (0, express_1.default)();
const port = config_1.config.app.port;
const name = config_1.config.app.name;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(logger_1.logMiddleware);
app.use('/api/image', image_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/chip', chip_routes_1.default);
app.use('/api/folder', folder_routes_1.default);
app.use('/api/bookmark', bookmark_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
(0, swagger_1.swagger)(app);
app.get('/', (request, response) => {
    response.send('Hello world');
});
app.listen(port, () => {
    console.log(`${name} started at http://localhost:${port}`);
});
