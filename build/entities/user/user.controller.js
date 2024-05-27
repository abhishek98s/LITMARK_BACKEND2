"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.patchUser = exports.postUser = exports.getUser = void 0;
const validator_1 = __importDefault(require("validator"));
const user_service_1 = require("./user.service");
const image_service_1 = require("../image/image.service");
const image_controller_1 = require("../image/image.controller");
const userExceptionMessages_1 = require("./constant/userExceptionMessages");
/**
 * The function `getUser` is an asynchronous function that retrieves a user by their ID and returns the
 * result as JSON.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the data property set to the result of the getUserById function.
 */
const getUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (!userId)
            throw new Error(userExceptionMessages_1.userExceptionMessages.INVALID_ID);
        const result = await (0, user_service_1.getUserById)(userId);
        return res.json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};
exports.getUser = getUser;
/**
 * The function `postUser` is an asynchronous function that handles the creation of a new user,
 * including validation of input data and saving an image if provided.
 * @param {Request} req - The `req` parameter is an object representing the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, and
 * request URL.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the data property set to the result variable.
 */
const postUser = async (req, res) => {
    try {
        const { username, email, password, role, user } = req.body;
        if (!username || !email || !password) {
            throw new Error(userExceptionMessages_1.userExceptionMessages.USER_CREDENTIALS_REQUIRED);
        }
        if (!(validator_1.default.isEmail(email) && validator_1.default.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }))) {
            throw new Error(userExceptionMessages_1.userExceptionMessages.INVALID_EMAIL_PASS);
        }
        if (req.file) {
            const imagePath = req.file.path;
            (0, image_controller_1.validateImageType)(req.file.originalname);
            const imageUrl = await (0, image_controller_1.uploadImage)(imagePath);
            const imageName = req.file.filename;
            const image = await (0, image_service_1.saveImage)({ url: imageUrl, type: 'user', name: imageName, isdeleted: false }, username);
            req.body.image_id = image.id;
        }
        else {
            req.body.image_id = 0;
        }
        const result = await (0, user_service_1.addUser)({
            username,
            email,
            password,
            image_id: req.body.image_id,
            isdeleted: false,
            role: role === 'admin' ? role : 'normal',
            created_by: user.username,
            updated_by: user.username,
        });
        return res.json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};
exports.postUser = postUser;
/**
 * The function `patchUser` is an asynchronous function that updates a user's information, including
 * their username, password, and profile image, and returns the updated user data.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request parameters, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the updated user data.
 */
const patchUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (!userId)
            throw new Error(userExceptionMessages_1.userExceptionMessages.INVALID_ID);
        const { username, password, user } = req.body;
        if (!username || !password) {
            throw new Error(userExceptionMessages_1.userExceptionMessages.USERNAME_PASS_REQUIRED);
        }
        if (!(validator_1.default.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }))) {
            throw new Error(userExceptionMessages_1.userExceptionMessages.PASS_VALIDATION);
        }
        const currentUser = await (0, user_service_1.getUserById)(userId);
        if (!currentUser) {
            throw new Error(userExceptionMessages_1.userExceptionMessages.USER_NOT_FOUND);
        }
        if (req.file) {
            const imagePath = req.file.path;
            const imageUrl = await (0, image_controller_1.uploadImage)(imagePath);
            const image = await (0, image_service_1.saveImage)({ url: imageUrl, type: 'user', name: req.file.filename, isdeleted: false }, username);
            req.body.image_id = image.id;
        }
        const result = await (0, user_service_1.updateUser)(userId, {
            ...currentUser,
            username,
            password,
            image_id: req.file ? req.body.image_id : currentUser.image_id,
            updated_by: user.username,
        });
        return res.json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};
exports.patchUser = patchUser;
/**
 * The deleteUser function is an asynchronous function that removes a user from the system based on the
 * provided user id.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, request headers, request body, request
 * parameters, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the data property set to the result of the removeUser function.
 */
const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (!userId)
            throw new Error(userExceptionMessages_1.userExceptionMessages.INVALID_ID);
        const result = await (0, user_service_1.removeUser)(userId);
        return res.json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};
exports.deleteUser = deleteUser;
