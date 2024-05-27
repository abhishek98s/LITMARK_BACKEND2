"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChip = exports.patchChip = exports.postChip = exports.getAllChips = void 0;
const chip_service_1 = require("./chip.service");
const chipExceptionMessages_1 = require("./constant/chipExceptionMessages");
/**
 * The function `getAllChips` is an asynchronous function that retrieves all chips and sends the result
 * as a JSON response.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the status
 * code, headers, and send the response body.
 */
const getAllChips = async (req, res) => {
    try {
        const result = await (0, chip_service_1.findAllChips)(req.body.user.id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getAllChips = getAllChips;
/**
 * The `postChip` function is an asynchronous function that handles the creation of a new chip by
 * extracting the necessary data from the request body, validating the required fields, and then adding
 * the chip to the database.
 * @param {Request} req - The `req` parameter is an object representing the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body. In this code snippet, the `res` object is used to send a JSON
 * response
 */
const postChip = async (req, res) => {
    try {
        const { name, folder_id, user } = req.body;
        if (!name || !folder_id) {
            throw new Error(chipExceptionMessages_1.chipExceptionMessages.Folder_NAME_REQUIRED);
        }
        const result = await (0, chip_service_1.addChip)({
            name,
            user_id: user.id,
            folder_id,
            isdeleted: false,
            created_by: user.username,
            updated_by: user.username,
        });
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.postChip = postChip;
/**
 * The function `patchChip` is an asynchronous function that handles a PATCH request to update a chip's
 * name and user.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, query parameters, and
 * request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status code, headers, and body. In this code snippet, the `res` object is used to send a JSON
 * response with
 */
const patchChip = async (req, res) => {
    try {
        const chipId = parseFloat(req.params.id);
        if (!chipId)
            throw new Error(chipExceptionMessages_1.chipExceptionMessages.INVALID_ID);
        const { name, user } = req.body;
        if (!name) {
            throw new Error(chipExceptionMessages_1.chipExceptionMessages.HAME_REQUIRED);
        }
        const currentChip = await (0, chip_service_1.findChipById)(chipId);
        if (!currentChip) {
            throw new Error(chipExceptionMessages_1.chipExceptionMessages.CHIP_NOTFOUND);
        }
        const result = await (0, chip_service_1.updateChip)({ ...currentChip, name, updated_by: user.username }, chipId);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.patchChip = patchChip;
/**
 * The `deleteChip` function is an asynchronous function that handles the deletion of a chip by its ID,
 * and returns a success message or an error message.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body. In this code snippet, it is used to send the response with a
 * status code of
 */
const deleteChip = async (req, res) => {
    try {
        const chipId = parseFloat(req.params.id);
        if (!chipId)
            throw new Error('Invalid chip id');
        const isChipExist = await (0, chip_service_1.findChipById)(chipId);
        if (!isChipExist) {
            throw new Error(chipExceptionMessages_1.chipExceptionMessages.CHIP_NOTFOUND);
        }
        const result = await (0, chip_service_1.removeChip)(chipId);
        res.status(200).json({ data: result });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteChip = deleteChip;
