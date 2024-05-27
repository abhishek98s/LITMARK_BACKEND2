"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = exports.updateImage = exports.saveImage = exports.findImage = void 0;
const imageExceptionMessages_1 = require("./constant/imageExceptionMessages");
const ImageDAO = __importStar(require("./image.repository"));
/**
 * The function `findImage` retrieves an image from a database based on its ID and returns it.
 * @param {number} imageId - The `imageId` parameter is the unique identifier of the image that you
 * want to find. It is of type `number`.
 * @returns a Promise that resolves to an ImageModel object.
 */
const findImage = async (imageId) => {
    const image = await ImageDAO.fetchById(imageId);
    if (!image)
        throw new Error(imageExceptionMessages_1.imageExceptionMessages.IMAGE_NOT_FOUND);
    return image;
};
exports.findImage = findImage;
/**
 * The `saveImage` function saves an image with the provided image data and the username of the
 * creator.
 * @param {ImageModel} imageData - The `imageData` parameter is an object of type `ImageModel` that
 * contains the data of the image to be saved. It likely includes properties such as the image URL,
 * file name, file size, and any other relevant information about the image.
 * @param {string} username - The `username` parameter is a string that represents the username of the
 * user who is saving the image.
 * @returns a promise that resolves to the result of inserting the new image into the "images" table in
 * the database.
 */
const saveImage = async (imageData, username) => {
    const newImage = {
        ...imageData,
        created_by: username,
        updated_by: username,
    };
    const image = await ImageDAO.create(newImage);
    const [image_id] = image;
    return await ImageDAO.fetchById(image_id);
};
exports.saveImage = saveImage;
/**
 * The function updates an image in the database with new data and returns the updated image.
 * @param {ImageModel} newImageData - The `newImageData` parameter is an object of type `ImageModel`
 * that contains the updated data for the image. It could include properties such as `url` (the new URL
 * of the image) and `type` (the new type of the image).
 * @param {number} imageId - The `imageId` parameter is the unique identifier of the image that needs
 * to be updated. It is used to locate the specific image in the database.
 * @param {string} username - The `username` parameter is a string that represents the username of the
 * user who is updating the image.
 * @returns a Promise that resolves to an ImageModel object.
 */
const updateImage = async (imageData, imageId) => {
    const image = await ImageDAO.update(imageData, imageId);
    if (!image)
        throw new Error(imageExceptionMessages_1.imageExceptionMessages.UPLOAD_FAILED); // update the comment
    return await ImageDAO.fetchById(imageId);
};
exports.updateImage = updateImage;
/**
 * The function removes an image from the database based on its ID.
 * @param {number} imageId - The `imageId` parameter is the unique identifier of the image that needs
 * to be removed.
 * @returns a Promise that resolves to an instance of the ImageModel.
 */
const removeImage = async (imageId) => {
    const image = await ImageDAO.fetchById(imageId);
    if (!image)
        throw new Error(imageExceptionMessages_1.imageExceptionMessages.IMAGE_NOT_FOUND);
    const removeImage = await ImageDAO.remove(imageId);
    if (!removeImage)
        throw new Error(imageExceptionMessages_1.imageExceptionMessages.DELETE_FAILED);
    return image;
};
exports.removeImage = removeImage;
