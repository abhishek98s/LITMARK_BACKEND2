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
exports.getRecentBookmarksByTitle = exports.filterRecentBookmarkByChip = exports.sortRecentBookmarkByAlphabet = exports.sortRecentBookmarkByDate = exports.deleteRecentBookmarkById = exports.findRecentClickedBookmarks = exports.updateClickedDate = exports.sortByAlphabet = exports.sortByDate = exports.getBookmarksByTitle = exports.removeBookmark = exports.updateBookmark = exports.addBookmark = exports.findBookmarksByFolderId = exports.findBookmarks = exports.findBookmarkById = void 0;
const ImageDAO = __importStar(require("../image/image.repository"));
const BookmarkDAO = __importStar(require("./bookmark.repository"));
const bookmarkExceptionMessages_1 = require("./constant/bookmarkExceptionMessages");
/**
 * The function finds a bookmark by its ID and returns it, or throws an error if the bookmark is not
 * found while filtering out
 * deleted bookmarks.
 * @param {number} bookmarkId - The `bookmarkId` parameter is the unique identifier of the bookmark
 * that you want to find. It is of type `number`.
 * @returns a bookmark object with the specified bookmarkId.
 */
const findBookmarkById = async (bookmarkId) => {
    const bookmarks = await BookmarkDAO.fetchById(bookmarkId);
    if (!bookmarks)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.BOOKMARK_NOT_FOUND);
    return bookmarks;
};
exports.findBookmarkById = findBookmarkById;
/**
 * The function `findBookmarks` retrieves all bookmarks from a database table and returns them while filtering out
 * deleted bookmarks.
 * @returns an array of BookmarkModel objects.
 */
const findBookmarks = async (user_id) => {
    const bookmarks = await BookmarkDAO.fetchAll(user_id);
    if (!bookmarks)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.BOOKMARK_EMPTY);
    return bookmarks;
};
exports.findBookmarks = findBookmarks;
/**
 * This function finds bookmarks by folder ID for a specific user while filtering out
 * deleted bookmarks.
 * @param {number} user_id - User ID is a unique identifier for a user in the system. It is used to
 * associate data and actions with a specific user account.
 * @param {number} folder_id - The `folder_id` parameter is the unique identifier of the folder for
 * which you want to find bookmarks.
 * @returns The function `findBookmarksByFolderId` returns an array of `BookmarkModel` objects that
 * match the provided `user_id` and `folder_id`.
 */
const findBookmarksByFolderId = async (user_id, folder_id) => {
    const bookmarks = await BookmarkDAO.fetchByFolderId(user_id, folder_id);
    if (!bookmarks)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.BOOKMARK_EMPTY);
    return bookmarks;
};
exports.findBookmarksByFolderId = findBookmarksByFolderId;
/**
 * The function `addBookmark` inserts a bookmark into a database table and returns the inserted
 * bookmark.
 * @param {BookmarkModel} bookmarkData - The `bookmarkData` parameter is an object of type
 * `BookmarkModel` that contains the data for the bookmark to be added.
 * @returns the bookmark that was inserted into the 'bookmarks' table.
 */
const addBookmark = async (bookmarkData) => {
    const bookmark = await BookmarkDAO.create(bookmarkData);
    if (!bookmark)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.ADD_FAILED);
    const [bookmarkId] = bookmark;
    return (0, exports.findBookmarkById)(bookmarkId);
};
exports.addBookmark = addBookmark;
/**
 * The function updates a bookmark in the database with the provided data and returns the updated
 * bookmark.
 * @param {BookmarkModel} bookmarkData - bookmarkData is an object that contains the updated data for
 * the bookmark. It should have properties that match the columns of the 'bookmarks' table in the
 * database.
 * @param {number} bookmarkId - The bookmarkId parameter is the unique identifier of the bookmark that
 * needs to be updated.
 * @returns the updated bookmark data.
 */
const updateBookmark = async (bookmarkData, bookmarkId) => {
    const bookmark = await BookmarkDAO.updateTitle(bookmarkData, bookmarkId);
    if (!bookmark)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.UPDATE_FAILED);
    return (0, exports.findBookmarkById)(bookmarkId);
};
exports.updateBookmark = updateBookmark;
/**
 * The function removes a bookmark from the database based on its ID.
 * @param {number} bookmarkId - The `bookmarkId` parameter is the unique identifier of the bookmark
 * that needs to be removed.
 * @returns the deleted bookmark.
 */
const removeBookmark = async (bookmarkId) => {
    const currentBookmark = await BookmarkDAO.fetchById(bookmarkId);
    if (!currentBookmark)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.BOOKMARK_NOT_FOUND);
    const bookmark = await BookmarkDAO.remove({ ...currentBookmark, isdeleted: true });
    if (!bookmark)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.DELETE_FAILED);
    ImageDAO.remove(currentBookmark.image_id);
    return currentBookmark;
};
exports.removeBookmark = removeBookmark;
/**
 * The function `getBookmarksByTitle` retrieves bookmarks by title and folder ID while filtering out
 * deleted bookmarks.
 * @param {string} title - The `title` parameter is a string that represents the title of the bookmarks
 * you want to retrieve. It is used to filter bookmarks based on a partial match of the title.
 * @param {number} folderId - The `folderId` parameter is a number that represents the ID of the folder
 * in which you want to search for bookmarks with a specific title.
 * @returns The function `getBookmarksByTitle` is returning an array of bookmarks that match the
 * provided `title` and belong to the specified `folderId`. The bookmarks are filtered based on the
 * case-insensitive comparison of the `title` field with the provided `title` string, and only
 * bookmarks that are not marked as deleted (`isdeleted` is false) and belong to the specified
 * `folderId
 */
const getBookmarksByTitle = async (title, folderId) => {
    const bookmarksByTitle = await BookmarkDAO.fetchByTitle(title, folderId);
    return bookmarksByTitle;
};
exports.getBookmarksByTitle = getBookmarksByTitle;
/**
 * The function `sortByDate` sorts bookmarks by date for a specific user and folder based on the
 * specified order.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user whose bookmarks
 * you want to sort.
 * @param {number} folder_id - The `folder_id` parameter in the `sortByDate` function represents the ID
 * of the folder containing bookmarks that you want to sort by date.
 * @param {string} sortOrder - The `sortOrder` parameter in the `sortByDate` function determines the
 * order in which the bookmarks will be sorted based on their date. It can be either 'asc' for
 * ascending order or 'desc' for descending order. This parameter specifies whether the bookmarks
 * should be sorted from oldest to newest ('
 * @returns The function `sortByDate` is returning a sorted list of bookmarks based on the specified
 * `userId`, `folder_id`, and `sortOrder`. If there are no bookmarks found for the given criteria, it
 * will throw an error with the message "bookmarkExceptionMessages.BOOKMARK_EMPTY".
 */
const sortByDate = async (userId, folder_id, sortOrder) => {
    const sortedData = await BookmarkDAO.sortBy('created_at', userId, folder_id, sortOrder);
    return sortedData;
};
exports.sortByDate = sortByDate;
/**
 * This TypeScript function sorts bookmarks by title alphabetically for a specific user and folder
 * based on the provided sortOrder.
 * @param {number} userId - The `userId` parameter is a number that represents the unique identifier of
 * the user for whom the bookmarks are being sorted.
 * @param {number} folder_id - The `folder_id` parameter in the `sortByAlphabet` function represents
 * the ID of the folder containing the bookmarks that you want to sort alphabetically.
 * @param {string} sortOrder - The `sortOrder` parameter in the `sortByAlphabet` function determines
 * the order in which the bookmarks will be sorted based on their titles. It can be either `'asc'` for
 * ascending order or `'desc'` for descending order. This parameter specifies whether the bookmarks
 * should be sorted alphabetically
 * @returns The function `sortByAlphabet` is returning a sorted list of bookmarks based on the title in
 * either ascending or descending order, filtered by the provided `userId`, `folder_id`, and
 * `isdeleted` condition. If the sorted data is empty, it will throw an error with the message
 * "BOOKMARK_EMPTY".
 */
const sortByAlphabet = async (userId, folder_id, sortOrder) => {
    const sortedData = await BookmarkDAO.sortBy('title', userId, folder_id, sortOrder);
    return sortedData;
};
exports.sortByAlphabet = sortByAlphabet;
/*
 * The function `updateClickedDate` updates a bookmark click_date in the database with the provided data.
 * @param {BookmarkModel} bookmarkData - BookmarkModel is a type representing the data structure of a
 * bookmark. It likely includes properties such as id, title, url, and any other relevant information
 * about a bookmark.
 * @returns The `updateClickedDate` function is returning nothing (`undefined`).
 */
const updateClickedDate = async (bookmarkData) => {
    const bookmark = await BookmarkDAO.updateClickedDate(bookmarkData);
    if (!bookmark)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.UPDATE_FAILED);
    return;
};
exports.updateClickedDate = updateClickedDate;
/*
 * This TypeScript function retrieves recent clicked bookmarks for a specific user ID.
 * @param {number} user_id - The `user_id` parameter is a number that represents the unique identifier
 * of a user in the system. It is used to filter bookmarks based on the user who clicked on them.
 * @returns The function `findRecentClickedBookmarks` returns an array of `BookmarkModel` objects
 * representing the recent clicked bookmarks for a specific user, based on the provided `user_id`.
 */
const findRecentClickedBookmarks = async (user_id) => {
    const bookmarks = await BookmarkDAO.sortRecentlyClickedBookmarkBy('click_date', user_id, 'desc');
    if (!bookmarks)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.BOOKMARK_EMPTY);
    return bookmarks;
};
exports.findRecentClickedBookmarks = findRecentClickedBookmarks;
/**
 * The function `deleteRecentBookmarkById` updates a bookmark's click_date to null in the database for
 * a specific user.
 * @param {BookmarkModel} bookmarkData - BookmarkModel - an object containing data of the bookmark to
 * be deleted
 * @param {number} user_id - The `user_id` parameter is the unique identifier of the user who owns the
 * bookmark that needs to be deleted. It is used to identify the specific user's bookmark that should
 * be deleted from the database.
 * @returns The `deleteRecentBookmarkById` function is returning nothing (`undefined`).
 */
const deleteRecentBookmarkById = async (bookmarkData, user_id) => {
    const newbookmarkData = { ...bookmarkData, click_date: null };
    const bookmark = await BookmarkDAO.removeRecentlyClickedBookmark(newbookmarkData, user_id);
    if (!bookmark)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.DELETE_FAILED);
    return;
};
exports.deleteRecentBookmarkById = deleteRecentBookmarkById;
/**
 * The function `sortRecentBookmarkByDate` retrieves recent bookmarks for a specific user and sorts
 * them based on click_date in a specified order and filtering out deleted bookmarks.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user for whom you
 * want to retrieve recent bookmarks.
 * @param {string} sortOrder - The `sortOrder` parameter specifies the order in which the bookmarks
 * should be sorted. It can have two possible values: "asc" for ascending order or "desc" for
 * descending order based on the `click_date` field.
 * @returns The function `sortRecentBookmarkByDate` returns an array of `BookmarkModel` objects that
 * represent recent bookmarks sorted by the `click_date` field in the specified `sortOrder` (ascending
 * or descending) for a specific `userId`. If there are no recent bookmarks found, it throws an error
 * with the message `EMPTY_RECENT_BOOKMARK`.
 */
const sortRecentBookmarkByDate = async (userId, sortOrder) => {
    const recentBookmarks = await BookmarkDAO.sortRecentlyClickedBookmarkBy('click_date', userId, sortOrder);
    if (recentBookmarks.length === 0)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.EMPTY_RECENT_BOOKMARK);
    return recentBookmarks;
};
exports.sortRecentBookmarkByDate = sortRecentBookmarkByDate;
/**
 * The function sorts recent bookmarks by title alphabetically in a specified order for a specific user and filtering out deleted bookmarks.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user whose bookmarks
 * you want to sort.
 * @param {string} sortOrder - The `sortOrder` parameter specifies the order in which the bookmarks
 * should be sorted. It can be either 'asc' for ascending order or 'desc' for descending order based on
 * the bookmark title.
 * @returns The function `sortRecentBookmarkByAlphabet` returns a sorted list of bookmarks based on the
 * title in either ascending or descending order, filtered by a specific user ID, and excluding any
 * bookmarks that are marked as deleted or have a null click date. If the sorted data is empty, an
 * error with the message "Bookmark empty" will be thrown.
 */
const sortRecentBookmarkByAlphabet = async (userId, sortOrder) => {
    const sortedData = await BookmarkDAO.sortRecentlyClickedBookmarkBy('title', userId, sortOrder);
    if (sortedData.length === 0)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.BOOKMARK_EMPTY);
    return sortedData;
};
exports.sortRecentBookmarkByAlphabet = sortRecentBookmarkByAlphabet;
/**
 * The function `filterRecentBookmarkByChip` filters recent bookmarks by user ID and chip ID while
 * ensuring they are not deleted and have a click date and filtering out deleted bookmarks.
 * @param {number} userId - The `userId` parameter represents the unique identifier of the user whose
 * bookmarks are being filtered.
 * @param {number} chipId - The `chipId` parameter in the `filterRecentBookmarkByChip` function
 * represents the ID of the chip that is used to filter the recent bookmarks for a specific user.
 * @returns The function `filterRecentBookmarkByChip` is returning the filtered bookmarks data based on
 * the provided `userId`, `chipId`, and additional conditions. If there are no bookmarks that match the
 * criteria, it will throw an error with the message `EMPTY_RECENT_BOOKMARK`.
 */
const filterRecentBookmarkByChip = async (userId, chipId) => {
    const filteredData = await BookmarkDAO.filterRecentlyClickedBookmarksByChip(userId, chipId);
    if (filteredData.length === 0)
        throw new Error(bookmarkExceptionMessages_1.bookmarkExceptionMessages.EMPTY_RECENT_BOOKMARK);
    return filteredData;
};
exports.filterRecentBookmarkByChip = filterRecentBookmarkByChip;
/**
 * The function `getRecentBookmarksByTitle` retrieves recent bookmarks by title from a database using a
 * case-insensitive search and filtering out deleted bookmarks.
 * @param {string} title - The `getRecentBookmarksByTitle` function is an asynchronous function that
 * retrieves recent bookmarks from a database table named 'bookmarks' based on a provided title. The
 * function uses the Knex query builder to interact with the database.
 * @returns The function `getRecentBookmarksByTitle` is returning an array of objects containing the
 * `title` and `url` of bookmarks that match the provided `title` string. These bookmarks are filtered
 * based on the following conditions:
 * 1. The `title` must contain the provided `title` string (case-insensitive match).
 * 2. The `isdeleted` field must be false.
 * 3.
 */
const getRecentBookmarksByTitle = async (title) => {
    const recentbookmarksByTitle = await BookmarkDAO.fetchRecentlyClickedBookmarksByTittle(title);
    return recentbookmarksByTitle;
};
exports.getRecentBookmarksByTitle = getRecentBookmarksByTitle;
