"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRecentBookmark = exports.filterRecentBookmark = exports.sortRecentBookmark = exports.deleteRecentBookmark = exports.addRecentBookmark = exports.getRecentBookmarks = exports.getSortedData = exports.searchByTitle = exports.deleteBookmark = exports.patchBookmark = exports.postBookmark = exports.getBookmarksByFolderId = exports.getBookmarks = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const bookmark_service_1 = require("./bookmark.service");
const image_controller_1 = require("../image/image.controller");
const image_service_1 = require("../image/image.service");
const bookmarkExceptionMessages_1 = require("./constant/bookmarkExceptionMessages");
const chip_service_1 = require("../chip/chip.service");
const folder_service_1 = require("../folder/folder.service");
const logger_1 = require("../../logger/logger");
const bookmark_1 = require("../../utils/bookmark");
dotenv_1.default.config();
/**
 * The function `getBookmarks` is an asynchronous function that retrieves bookmarks and sends them as a
 * response in JSON format.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request headers, query parameters, request body, and
 * more.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the status
 * code, headers, and send the response body.
 */
const getBookmarks = async (req, res) => {
    try {
        const { user } = req.body;
        const result = await (0, bookmark_service_1.findBookmarks)(user.id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getBookmarks = getBookmarks;
/**
 * The function `getBookmarksByFolderId` retrieves bookmarks by folder ID for a specific user and sends
 * the result as a JSON response.
 * @param {Request} req - The `req` parameter in the `getBookmarksByFolderId` function stands for the
 * HTTP request object. It contains information about the incoming request such as headers, parameters,
 * body, etc. This parameter is of type `Request` which is typically provided by web frameworks like
 * Express.js in Node
 * @param {Response} res - The `res` parameter in the `getBookmarksByFolderId` function is an instance
 * of the Express Response object. It is used to send a response back to the client making the request.
 * In this function, we are using `res` to send a JSON response with the bookmarks data or
 */
const getBookmarksByFolderId = async (req, res) => {
    try {
        const { user } = req.body;
        const folder_id = parseInt(req.params.folder_id);
        const result = await (0, bookmark_service_1.findBookmarksByFolderId)(user.id, folder_id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getBookmarksByFolderId = getBookmarksByFolderId;
/**
 * The `postBookmark` function is an asynchronous function that handles the creation of a new bookmark,
 * including uploading an image if provided, and returns the created bookmark data.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 */
const postBookmark = async (req, res) => {
    try {
        const { url, folder_id, user } = req.body;
        if (!url || !folder_id) {
            throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.LINK_FOLDER_REQUIRED);
        }
        const isFolder = await (0, folder_service_1.findFolderById)(folder_id);
        if (!isFolder)
            throw new Error('Folder does\'nt exist.');
        const imageName = crypto_1.default.randomUUID();
        const imageUrl = await (0, bookmark_1.getThumbnailFromURL)(url);
        const imageFromDB = await (0, image_service_1.saveImage)({ url: imageUrl, type: 'bookmark', name: imageName, isdeleted: false }, user.username);
        const chipData = {
            name: isFolder.name,
            user_id: user.id,
            folder_id,
            isdeleted: false,
            created_by: user.username,
            updated_by: user.username,
        };
        const chip = await (0, chip_service_1.addChip)(chipData);
        const bookmarkData = {
            url,
            folder_id,
            title: await (0, bookmark_1.getTitleFromURL)(url),
            image_id: imageFromDB.id || 1,
            chip_id: chip.id || 1,
            user_id: user.id,
            date: new Date(),
            isdeleted: false,
            created_by: user.username,
            updated_by: user.username,
        };
        const result = await (0, bookmark_service_1.addBookmark)(bookmarkData);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.postBookmark = postBookmark;
/**
 * The function `patchBookmark` updates a bookmark with the provided data, including the title and
 * image, and returns the updated bookmark.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request parameters, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status, headers, and body. In this code snippet, it is used to send a JSON response with the updated
 * bookmark data or
 */
const patchBookmark = async (req, res) => {
    try {
        const bookmarkId = parseInt(req.params.id);
        if (!bookmarkId) {
            throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.INVALID_ID);
        }
        const { title, user, folder_id } = req.body;
        const currentBookmark = await (0, bookmark_service_1.findBookmarkById)(bookmarkId);
        const { title: currentBookmarkTitle, image_id: currentBookmarkImage, folder_id: currentBookmarkFolderId } = currentBookmark;
        if (req.file) {
            const imagePath = req.file.path;
            const imageUrl = await (0, image_controller_1.uploadImage)(imagePath);
            const image = await (0, image_service_1.saveImage)({ url: imageUrl, type: 'bookmark', name: req.file.filename, isdeleted: false }, user.username);
            req.body.image_id = image.id;
        }
        const bookmarkData = {
            ...currentBookmark,
            title: title || currentBookmarkTitle,
            folder_id: folder_id || currentBookmarkFolderId,
            image_id: req.body.image_id || currentBookmarkImage,
            updated_by: user.username,
        };
        const result = await (0, bookmark_service_1.updateBookmark)(bookmarkData, bookmarkId);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.patchBookmark = patchBookmark;
/**
 * The function `deleteBookmark` is an asynchronous function that handles the deletion of a bookmark by
 * its ID and returns a JSON response with the result.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the status
 * code, headers, and send the response body.
 */
const deleteBookmark = async (req, res) => {
    try {
        const bookmarkId = parseInt(req.params.id);
        if (!bookmarkId) {
            throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.INVALID_ID);
        }
        const result = await (0, bookmark_service_1.removeBookmark)(bookmarkId);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteBookmark = deleteBookmark;
/**

 * This TypeScript function searches for bookmarks by title and returns the results in a JSON format,
 * handling errors appropriately.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `searchByTitle` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by a web framework like Express in Node.js. This object
 * allows you to send data back to
 */
const searchByTitle = async (req, res) => {
    try {
        const title = req.query.title;
        const folder_id = req.query.folder_id;
        if (!title) {
            throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.SEARCH_QUERY_EMPTY);
        }
        const result = await (0, bookmark_service_1.getBookmarksByTitle)(title, folder_id);
        logger_1.logger.error(result);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.searchByTitle = searchByTitle;
/*
 * The function `getSortedData` in TypeScript fetches and sorts data based on specified criteria like
 * date or alphabet for a given user and folder.
 * @param {Request} req - The `req` parameter in the `getSortedData` function represents the request
 * object, which contains information about the HTTP request that was made. This object includes
 * properties such as `query` (for query parameters), `body` (for request body data), `params` (for
 * route parameters),
 * @param {Response} res - The `res` parameter in the `getSortedData` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by a web framework like Express in Node.js. The `res` object
 * has methods like `
 */
const getSortedData = async (req, res) => {
    try {
        const sortBy = req.query.sort;
        const folder_id = req.query.folder_id;
        const sortOrder = req.query.order || 'asc';
        const { user } = req.body;
        let result;
        switch (sortBy) {
            case 'date':
                result = await (0, bookmark_service_1.sortByDate)(user.id, folder_id, sortOrder);
                break;
            case 'alphabet':
                result = await (0, bookmark_service_1.sortByAlphabet)(user.id, folder_id, sortOrder);
                break;
            default:
                new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.INVALID_DATA);
                break;
        }
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getSortedData = getSortedData;
const getRecentBookmarks = async (req, res) => {
    try {
        const { user } = req.body;
        const result = await (0, bookmark_service_1.findRecentClickedBookmarks)(user.id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getRecentBookmarks = getRecentBookmarks;
/**
 * The function `bookmarkClick` updates the click_date of a bookmark based on the provided ID.
 * @param {Request} req - The `req` parameter in the `bookmarkClick` function is of type `Request`,
 * which is typically used to represent the HTTP request in Express.js or other Node.js frameworks. It
 * contains information about the incoming request such as headers, parameters, body, etc. You can
 * access specific data from the
 * @param {Response} res - The `res` parameter in the `bookmarkClick` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by a web framework like Express in Node.js. The `res` object
 * has methods like `status
 */
const addRecentBookmark = async (req, res) => {
    try {
        const bookmarkId = parseInt(req.params.id);
        if (!bookmarkId) {
            throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.INVALID_ID);
        }
        const isBookmarkPresent = await (0, bookmark_service_1.findBookmarkById)(bookmarkId);
        await (0, bookmark_service_1.updateClickedDate)({ ...isBookmarkPresent, click_date: new Date() });
        res.status(200).json({ data: { msg: 'Bookmark date updated.' } });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.addRecentBookmark = addRecentBookmark;
/**
 * The function `deleteRecentBookmark` deletes a recent bookmark associated with a user based on the
 * provided bookmark ID.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the function `deleteRecentBookmark` is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by an Express.js server. This object allows you to send data
 * back to the client, set
 */
const deleteRecentBookmark = async (req, res) => {
    try {
        const { user } = req.body;
        const bookmarkId = parseInt(req.params.id);
        const currentBookmark = await (0, bookmark_service_1.findBookmarkById)(bookmarkId);
        await (0, bookmark_service_1.deleteRecentBookmarkById)(currentBookmark, user.id);
        res.status(200).json({ data: { msg: 'Recent bookmark deleted' } });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteRecentBookmark = deleteRecentBookmark;
/**
 * The function `sortRecentBookmark` sorts recent bookmarks based on a specified criteria and order.
 * @param {Request} req - The `req` parameter in the `sortRecentBookmark` function stands for the
 * incoming request object. It contains information about the HTTP request made to the server,
 * including headers, body, query parameters, and more. In this case, it is specifically of type
 * `Request`, which is likely from a
 * @param {Response} res - The `res` parameter in the `sortRecentBookmark` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by an Express.js server. This object allows you to send data
 * back to the client, set
 */
const sortRecentBookmark = async (req, res) => {
    try {
        const { user } = req.body;
        const sortType = req.query.sortBy;
        const sortOrder = req.query.order || 'asc';
        let result;
        switch (sortType) {
            case 'date':
                result = await (0, bookmark_service_1.sortRecentBookmarkByDate)(user.id, sortOrder);
                break;
            case 'alphabet':
                result = await (0, bookmark_service_1.sortRecentBookmarkByAlphabet)(user.id, sortOrder);
                break;
            default:
                result = await (0, bookmark_service_1.sortRecentBookmarkByDate)(user.id, 'desc');
                break;
        }
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.sortRecentBookmark = sortRecentBookmark;
/**
 * The function `filterRecentBookmark` filters recent bookmarks based on a specified sort type and chip
 * ID.
 * @param {Request} req - The `req` parameter in the `filterRecentBookmark` function represents the
 * incoming request to the server. It contains information such as the request headers, body, query
 * parameters, and other details sent by the client making the request. In this specific function, the
 * `req` parameter is of type `
 * @param {Response} res - The `res` parameter in the `filterRecentBookmark` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by an Express.js server. The `res` object has methods like
 * `status()` to set
 */
const filterRecentBookmark = async (req, res) => {
    try {
        const { user } = req.body;
        const sortType = req.query.filterBy;
        const chipId = req.query.chip_id;
        let result;
        switch (sortType) {
            case 'chips':
                result = await (0, bookmark_service_1.filterRecentBookmarkByChip)(user.id, chipId);
                break;
            default:
                result = await (0, bookmark_service_1.findRecentClickedBookmarks)(user.id);
                break;
        }
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.filterRecentBookmark = filterRecentBookmark;
/**
 * This TypeScript function searches for recent bookmarks by title and returns the result in a JSON
 * format.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `searchRecentBookmark` function is an instance of
 * the Express Response object. It is used to send a response back to the client making the request. In
 * this function, it is used to send a JSON response with the search results or an error message along
 * with the
 */
const searchRecentBookmark = async (req, res) => {
    try {
        const title = req.query.title;
        if (!title) {
            throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.SEARCH_QUERY_EMPTY);
        }
        const result = await (0, bookmark_service_1.getRecentBookmarksByTitle)(title);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.searchRecentBookmark = searchRecentBookmark;
