import knex from '../../config/knex.config'
import { BookmarkModel } from './bookmark.model'
import { bookmarkExceptionMessages } from './constant/bookmarkExceptionMessages';

/**
 * The function finds a bookmark by its ID and returns it, or throws an error if the bookmark is not
 * found while filtering out
 * deleted bookmarks.
 * @param {number} bookmarkId - The `bookmarkId` parameter is the unique identifier of the bookmark
 * that you want to find. It is of type `number`.
 * @returns a bookmark object with the specified bookmarkId.
 */
export const findBookmarkById = async (bookmarkId: number) => {
    const bookmarks: BookmarkModel = await knex('bookmarks').select('*').where('id', bookmarkId).andWhere('isdeleted', false).first();
    if (!bookmarks) throw new Error(bookmarkExceptionMessages.BOOKMARK_NOT_FOUND)

    return bookmarks;
}

/**
 * The function `findBookmarks` retrieves all bookmarks from a database table and returns them while filtering out
 * deleted bookmarks.
 * @returns an array of BookmarkModel objects.
 */
export const findBookmarks = async (user_id: number) => {
    const bookmarks: BookmarkModel[] = await knex('bookmarks').select('*').where('user_id', user_id).andWhere('isdeleted', 0);
    if (!bookmarks) throw new Error(bookmarkExceptionMessages.BOOKMARK_EMPTY)

    return bookmarks;
}

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
export const findBookmarksByFolderId = async (user_id: number, folder_id: number) => {
    const bookmarks: BookmarkModel[] = await knex('bookmarks').select('*').where('user_id', user_id).andWhere('folder_id', folder_id).andWhere('isdeleted', 0);
    if (!bookmarks) throw new Error(bookmarkExceptionMessages.BOOKMARK_EMPTY)

    return bookmarks;
}

/**
 * The function `addBookmark` inserts a bookmark into a database table and returns the inserted
 * bookmark.
 * @param {BookmarkModel} bookmarkData - The `bookmarkData` parameter is an object of type
 * `BookmarkModel` that contains the data for the bookmark to be added.
 * @returns the bookmark that was inserted into the 'bookmarks' table.
 */
export const addBookmark = async (bookmarkData: BookmarkModel) => {
    const bookmark = await knex('bookmarks').insert(bookmarkData);
    if (!bookmark) throw new Error(bookmarkExceptionMessages.ADD_FAILED);

    const [bookmarkId] = bookmark;

    return findBookmarkById(bookmarkId)
}

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
export const updateBookmark = async (bookmarkData: BookmarkModel, bookmarkId: number) => {
    const bookmark = await knex('bookmarks').update(bookmarkData).where('id', bookmarkId);
    if (!bookmark) throw new Error(bookmarkExceptionMessages.UPDATE_FAILED);

    return findBookmarkById(bookmarkId);
}

/**
 * The function removes a bookmark from the database based on its ID.
 * @param {number} bookmarkId - The `bookmarkId` parameter is the unique identifier of the bookmark
 * that needs to be removed.
 * @returns the deleted bookmark.
 */
export const removeBookmark = async (bookmarkId: number) => {
    const currentBookmark: BookmarkModel = await findBookmarkById(bookmarkId);
    if (!currentBookmark) throw new Error(bookmarkExceptionMessages.BOOKMARK_NOT_FOUND);

    const bookmark = await knex('bookmarks').update({ ...currentBookmark, isdeleted: true }).where('id', bookmarkId);
    if (!bookmark) throw new Error(bookmarkExceptionMessages.DELETE_FAILED);

    return currentBookmark;
}

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
export const getBookmarksByTitle = async (title: string, folderId: number) => {
    const bookmarksByTitle = await knex('bookmarks').select('title', 'url').whereRaw('LOWER(title) LIKE LOWER(?)', [`%${title}%`]).andWhere('isdeleted', false).andWhere('folder_id', folderId)
    return bookmarksByTitle
}
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
export const sortByDate = async (userId: number, folder_id: number, sortOrder: string) => {
    const sortedData = await knex('bookmarks').orderBy('date', sortOrder).where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folder_id);
    if (sortedData.length === 0) throw new Error(bookmarkExceptionMessages.BOOKMARK_EMPTY)
    return sortedData;
}

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
export const sortByAlphabet = async (userId: number, folder_id: number, sortOrder: string) => {
    const sortedData = await knex('bookmarks').orderBy('title', sortOrder).where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folder_id);
    if (sortedData.length === 0) throw new Error(bookmarkExceptionMessages.BOOKMARK_EMPTY)
    return sortedData;
}
/*
 * The function `updateClickedDate` updates a bookmark click_date in the database with the provided data.
 * @param {BookmarkModel} bookmarkData - BookmarkModel is a type representing the data structure of a
 * bookmark. It likely includes properties such as id, title, url, and any other relevant information
 * about a bookmark.
 * @returns The `updateClickedDate` function is returning nothing (`undefined`).
 */
export const updateClickedDate = async (bookmarkData: BookmarkModel) => {
    const bookmark = await knex('bookmarks').update(bookmarkData).where('id', bookmarkData.id)
    if (!bookmark) throw new Error(bookmarkExceptionMessages.UPDATE_FAILED);
    return
}
/*
 * This TypeScript function retrieves recent clicked bookmarks for a specific user ID.
 * @param {number} user_id - The `user_id` parameter is a number that represents the unique identifier
 * of a user in the system. It is used to filter bookmarks based on the user who clicked on them.
 * @returns The function `findRecentClickedBookmarks` returns an array of `BookmarkModel` objects
 * representing the recent clicked bookmarks for a specific user, based on the provided `user_id`.
 */
export const findRecentClickedBookmarks = async (user_id: number) => {
    const bookmarks: BookmarkModel[] = await knex('bookmarks').select('*').where('user_id', user_id).andWhere('isdeleted', 0).andWhereNot('click_date', null).orderBy('click_date', 'desc');
    if (!bookmarks) throw new Error(bookmarkExceptionMessages.BOOKMARK_EMPTY)

    return bookmarks;
}

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
export const deleteRecentBookmarkById = async (bookmarkData: BookmarkModel, user_id: number) => {
    const bookmark = await knex('bookmarks').update({ ...bookmarkData, click_date: null }).where('user_id', user_id).andWhere('id', bookmarkData.id);
    if (!bookmark) throw new Error(bookmarkExceptionMessages.DELETE_FAILED)

    return
}
