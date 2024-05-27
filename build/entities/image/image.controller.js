"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.patchImage = exports.postImage = exports.getImage = exports.validateImageType = exports.uploadImage = exports.isValidType = void 0;
const http_status_codes_1 = require("http-status-codes");
const image_service_1 = require("./image.service");
const imageExceptionMessages_1 = require("./constant/imageExceptionMessages");
const imageUploader_1 = __importDefault(require("../../utils/imageUploader"));
/**
 * The function checks if the type of an image is valid by matching it against a regular
 * expression.
 * @param {ImageModel}  - The above code is a TypeScript function named `isValidType` that takes an
 * object of type `ImageModel` as a parameter. The `ImageModel` is expected to have a property named
 * `type`.
 * @returns a boolean value of true.
 */
const isValidType = ({ type }) => {
    const reg = new RegExp(/\b(?:folder|user|bookmark)\b/i);
    const isNameValid = reg.test(type);
    if (!isNameValid)
        throw new Error(imageExceptionMessages_1.imageExceptionMessages.INVALID_TYPE);
    return true;
};
exports.isValidType = isValidType;
/**
 * The function `uploadImage` uploads an image to Cloudinary and returns the secure URL of the uploaded
 * image.
 * @param {string} imgPath - The `imgPath` parameter is a string that represents the path to the image
 * file that you want to upload.
 * @returns The function `uploadImage` returns the `imgUrl` which is the secure URL of the uploaded
 * image.
 */
const uploadImage = async (imgPath) => {
    const imgUrl = (await imageUploader_1.default.v2.uploader.upload(imgPath, { folder: "litmark" })).secure_url;
    if (!imgUrl)
        throw new Error(imageExceptionMessages_1.imageExceptionMessages.UPLOAD_FAILED);
    return imgUrl;
};
exports.uploadImage = uploadImage;
/**
 * The function `validateImageType` checks if a given file name has a valid image type (png, jpg, jpeg,
 * or gif) and throws an error if it doesn't.
 * @param {string} fileName - The `fileName` parameter is a string that represents the name of the
 * image file.
 * @returns nothing (void).
 */
const validateImageType = (fileName) => {
    const imageType = fileName.split(".").pop();
    const reg = new RegExp(/\b(?:png|jpg|jpeg|gif)\b/i);
    const isValidType = reg.test(imageType);
    if (!isValidType)
        throw new Error(imageExceptionMessages_1.imageExceptionMessages.INVALID_IMAGE_TYPE);
    return;
};
exports.validateImageType = validateImageType;
/**
 * The function `getImage` is an asynchronous function that handles a request to retrieve an image by
 * its ID and returns the image data if found, or an error message if not found or if there is an
 * internal server error.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status code, headers, and body. In this code snippet, it is used to send a JSON response with the
 * image data or
 * @returns a response with the status code 200 (OK) and a JSON object containing the data of the
 * image.
 */
const getImage = async (req, res) => {
    try {
        const imageId = parseInt(req.params.id);
        if (!imageId)
            throw new Error(imageExceptionMessages_1.imageExceptionMessages.INVALID_ID);
        const result = await (0, image_service_1.findImage)(imageId);
        if (!result)
            throw new Error(imageExceptionMessages_1.imageExceptionMessages.IMAGE_NOT_FOUND);
        return res.status(http_status_codes_1.StatusCodes.OK).json({ data: result });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: error.message,
            error: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};
exports.getImage = getImage;
/**
 * The `postImage` function handles the uploading and saving of an image file, including validation and
 * error handling.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, and
 * request URL.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the data property set to the result of the saveImage function.
 */
const postImage = async (req, res) => {
    var _a;
    try {
        if (!req.file) {
            throw new Error(imageExceptionMessages_1.imageExceptionMessages.FILE_REQUIRED);
        }
        const imgPath = req.file.path;
        req.body.url = await (0, exports.uploadImage)(imgPath);
        req.body.name = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const { url, type, name, user } = req.body;
        if (!type)
            throw new Error(imageExceptionMessages_1.imageExceptionMessages.TYPE_REQUIRED);
        (0, exports.isValidType)(req.body);
        (0, exports.validateImageType)(req.file.originalname);
        const result = await (0, image_service_1.saveImage)({ type, url, name, isdeleted: false }, user.username);
        res.status(http_status_codes_1.StatusCodes.OK).json({ data: result });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: error.message,
            error: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};
exports.postImage = postImage;
/**
 * The function `patchImage` is an asynchronous function that handles the patch request for updating an
 * image with the specified ID, including uploading a new image file if provided.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, and other relevant details.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It is an instance of the `Response` class from the Express framework.
 * @returns a JSON response with the updated image data if successful, or an error message and status
 * code if there is an error.
 */
const patchImage = async (req, res) => {
    try {
        const imageId = parseInt(req.params.id);
        const { name, user } = req.body;
        if (!name)
            throw new Error(imageExceptionMessages_1.imageExceptionMessages.NAME_REQUIRED);
        const currentImage = await (0, image_service_1.findImage)(imageId);
        if (req.file) {
            const imgPath = req.file.path;
            req.body.url = await (0, exports.uploadImage)(imgPath);
        }
        // const result: ImageModel = await updateImage({ url, type, name }, imageId, user.id)
        const result = await (0, image_service_1.updateImage)({
            ...currentImage,
            name,
            updated_by: user.username,
            url: req.file ? req.body.url : currentImage.url,
        }, imageId);
        res.status(http_status_codes_1.StatusCodes.OK).json({ data: result });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: error.message,
            error: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};
exports.patchImage = patchImage;
/**
 * The function `deleteImage` is an asynchronous function that handles the deletion of an image based
 * on the provided image ID.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body.
 * @returns a JSON response with the data property set to the result of the removeImage function.
 */
const deleteImage = async (req, res) => {
    try {
        const imageId = parseInt(req.params.id);
        if (!imageId)
            throw new Error(imageExceptionMessages_1.imageExceptionMessages.INVALID_ID);
        const result = await (0, image_service_1.removeImage)(imageId);
        res.status(http_status_codes_1.StatusCodes.OK).json({ data: result });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: error.message,
            error: (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
        });
    }
};
exports.deleteImage = deleteImage;
