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
exports.sortByAlphabet = exports.sortByDate = exports.removeFolder = exports.updateFolder = exports.addFolders = exports.findFolderById = exports.findAllNestedFolders = exports.findAllFolders = void 0;
const folderExceptionMessages_1 = require("./constant/folderExceptionMessages");
const FolderDAO = __importStar(require("./folder.repository"));
const BookmarkDAO = __importStar(require("../bookmark/bookmark.repository"));
/**
 * The function `findAllFolders` retrieves all folders from a database using Knex and returns them as
 * an array of `FolderModel` objects.
 * @returns an array of FolderModel objects.
 */
const findAllFolders = async (user_id) => {
    const folders = await FolderDAO.fetchAllParent(user_id);
    if (!folders)
        throw new Error(folderExceptionMessages_1.folderExceptionMessages.FOLDER_EMPTY);
    return folders;
};
exports.findAllFolders = findAllFolders;
const findAllNestedFolders = async (user_id, parentFolderId) => {
    const folders = await FolderDAO.fetchAllNested(user_id, parentFolderId);
    if (!folders)
        throw new Error(folderExceptionMessages_1.folderExceptionMessages.FOLDER_EMPTY);
    return folders;
};
exports.findAllNestedFolders = findAllNestedFolders;
/**
 * The function `findFolderById` is an asynchronous function that retrieves a folder by its ID from a
 * database using Knex and returns it.
 * @param {number} folderId - The `folderId` parameter is the unique identifier of the folder you want
 * to find. It is of type `number`.
 * @returns a Promise that resolves to a FolderModel object.
 */
const findFolderById = async (folderId) => {
    const folder = await FolderDAO.fetchById(folderId);
    if (!folder)
        throw new Error(folderExceptionMessages_1.folderExceptionMessages.FOLDER_NOT_FOUND);
    return folder;
};
exports.findFolderById = findFolderById;
/**
 * The function `addFolders` inserts folder data into a database table and returns the inserted folder.
 * @param {FolderModel} folderData - The `folderData` parameter is an object of type `FolderModel` that
 * contains the data for the folder to be added.
 * @returns the inserted folder data.
 */
const addFolders = async (folderData) => {
    const folder = await FolderDAO.create(folderData);
    if (!folder)
        throw new Error(folderExceptionMessages_1.folderExceptionMessages.ADD_FAILED);
    const [folder_Id] = folder;
    return await FolderDAO.fetchById(folder_Id);
};
exports.addFolders = addFolders;
/**
 * The function updates a folder in a database using the provided folder data and folder ID.
 * @param {FolderModel} folderData - The `folderData` parameter is an object that represents the
 * updated data for the folder. It should contain the properties and values that need to be updated in
 * the folder record in the database.
 * @param {number} folderId - The `folderId` parameter is the unique identifier of the folder that
 * needs to be updated. It is of type `number`.
 * @returns the updated folder data.
 */
const updateFolder = async (folderData, folderId) => {
    const folder = await FolderDAO.update(folderData, folderId);
    if (!folder)
        throw new Error(folderExceptionMessages_1.folderExceptionMessages.UPDATE_FOLDER);
    return await FolderDAO.fetchById(folderId);
};
exports.updateFolder = updateFolder;
/**
 * The function `removeFolder` recursively deletes a folder and its subfolders along with their
 * associated bookmarks by updating their `isdeleted` flag in the database.
 * @param {number} folderId - The `removeFolder` function is designed to recursively delete a folder
 * and all its subfolders and bookmarks from a database. The function takes a `folderId` parameter,
 * which is the unique identifier of the folder to be deleted. The function first retrieves all
 * subfolders of the given folder, then recursively
 * @returns The `removeFolder` function is returning nothing explicitly, as it ends with `return`
 * without any value.
 */
const removeFolder = async (folderId) => {
    const subfolders = await FolderDAO.fetchAllByFolderId(folderId);
    for (const subfolder of subfolders) {
        await (0, exports.removeFolder)(subfolder.id);
    }
    await FolderDAO.remove(folderId);
    await BookmarkDAO.removeByFolderid(folderId);
    return;
};
exports.removeFolder = removeFolder;
/**
 * The function `sortByDate` sorts data from a specific folder by date for a given user based on the
 * specified order.
 * @param {number} userId - The `userId` parameter in the `sortByDate` function is the unique
 * identifier of the user for whom you want to sort the data.
 * @param {number} folder_id - The `folder_id` parameter in the `sortByDate` function represents the
 * unique identifier of the folder for which you want to retrieve and sort the data. It is used to
 * filter the data based on the specified folder.
 * @param {string} sortOrder - The `sortOrder` parameter in the `sortByDate` function determines the
 * order in which the data will be sorted. It can be either 'asc' for ascending order or 'desc' for
 * descending order based on the 'date' field in the database table.
 * @returns The function `sortByDate` is returning the sorted data from the `folders` table based on
 * the specified `userId`, `folder_id`, and `sortOrder`. If the sorted data is empty, it will throw an
 * error with the message `FOLDER_EMPTY`.
 */
const sortByDate = async (userId, folder_id, sortOrder) => {
    const sortedData = await FolderDAO.sortBy('created_at', userId, folder_id, sortOrder);
    return sortedData;
};
exports.sortByDate = sortByDate;
/**
 * The function sorts folders by title alphabetically for a specific user and folder ID.
 * @param {number} userId - The `userId` parameter in the `sortByAlphabet` function represents the
 * unique identifier of the user for whom the folders are being sorted.
 * @param {number} folder_id - The `folder_id` parameter in the `sortByAlphabet` function represents
 * the unique identifier of the folder for which you want to sort the data. It is used to filter the
 * data based on the specified folder.
 * @param {string} sortOrder - The `sortOrder` parameter in the `sortByAlphabet` function determines
 * the order in which the data will be sorted. It can be either `'asc'` for ascending order or `'desc'`
 * for descending order based on the `title` field of the folders table.
 * @returns The function `sortByAlphabet` is returning the sorted data from the `folders` table based
 * on the `title` column and the specified `sortOrder`. The data is filtered by `user_id`, `isdeleted`,
 * and `folder_id`. If the sorted data is empty, an error with the message `FOLDER_EMPTY` will be
 * thrown.
 */
const sortByAlphabet = async (userId, folder_id, sortOrder) => {
    const sortedData = await FolderDAO.sortBy('name', userId, folder_id, sortOrder);
    return sortedData;
};
exports.sortByAlphabet = sortByAlphabet;
