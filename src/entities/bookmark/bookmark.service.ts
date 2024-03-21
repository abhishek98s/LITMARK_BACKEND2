import knex from '../../config/knex.config'
import { BookmarkModel } from './bookmark.model'
import { bookmarkExceptionMessages } from './constant/bookmarkExceptionMessages';

/**
 * The function finds a bookmark by its ID and returns it, or throws an error if the bookmark is not
 * found.
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
 * The function `findBookmarks` retrieves all bookmarks from a database table and returns them.
 * @returns an array of BookmarkModel objects.
 */
export const findBookmarks = async (user_id: number) => {
    const bookmarks: BookmarkModel[] = await knex('bookmarks').select('*').where('user_id', user_id).andWhere('isdeleted', 0);
    if (!bookmarks) throw new Error(bookmarkExceptionMessages.BOOKMARK_EMPTY)

    return bookmarks;
}

/**
 * This function finds bookmarks by folder ID for a specific user.
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


export const findRecentClickedBookmarks = async (user_id: number) => {
    const bookmarks: BookmarkModel[] = await knex('bookmarks').select('*').where('user_id', user_id).andWhere('isdeleted', 0).andWhereNot('click_date', null).orderBy('click_date', 'desc');
    if (!bookmarks) throw new Error(bookmarkExceptionMessages.BOOKMARK_EMPTY)

    return bookmarks;
}
