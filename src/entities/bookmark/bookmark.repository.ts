import knex from '../../config/knex.config'
import { BookmarkModel } from './bookmark.model';


/**
 * This TypeScript function fetches a bookmark by its ID from a database table, ensuring it is not
 * marked as deleted, and returns the bookmark model.
 * @param {number} bookmarkId - The `bookmarkId` parameter is the unique identifier of the bookmark
 * that you want to fetch from the database. It is used to query the database for a specific bookmark
 * based on its ID.
 * @returns The `fetchById` function is returning a Promise that resolves to a `BookmarkModel` object.
 * The function fetches a bookmark from the database based on the `bookmarkId`, ensuring that the
 * bookmark is not deleted (`isdeleted` is false). The retrieved bookmark data includes the fields:
 * 'id', 'url', 'image_id', 'user_id', 'folder_id', 'chip_id', 'title', 'date, 'date'
 */
export const fetchById = async (bookmarkId: number): Promise<BookmarkModel> => {
    const bookmark = await knex('bookmarks').where('id', bookmarkId).andWhere('isdeleted', false).select('id', 'url', 'image_id', 'user_id', 'folder_id', 'chip_id', 'title', 'date');
    return bookmark[0];
}

/**
 * This TypeScript function fetches all bookmarks belonging to a specific user that are not marked as
 * deleted.
 * @param {number} user_id - The `user_id` parameter is a number that is used to filter bookmarks based
 * on the user who created them.
 * @returns The `fetchAll` function is returning a Promise that resolves to an array of `BookmarkModel`
 * objects. These objects contain properties such as `id`, `url`, `image_id`, `user_id`, `folder_id`,
 * `chip_id`, 'date' and `title`. The function fetches bookmarks from the database table `bookmarks` where the
 * `user_id` matches the provided `user_id` parameter
 */
export const fetchAll = async (user_id: number): Promise<BookmarkModel[]> => {
    return await knex('bookmarks').select('id', 'url', 'image_id', 'user_id', 'folder_id', 'chip_id', 'title', 'date').where('user_id', user_id).andWhere('isdeleted', false);
}

/**
 * This TypeScript function fetches bookmarks by user ID and folder ID while excluding deleted
 * bookmarks.
 * @param {number} user_id - The `user_id` parameter is a number that represents the unique identifier
 * of the user whose bookmarks are being fetched.
 * @param {number} folder_id - The `folder_id` parameter in the `fetchByFolderId` function represents
 * the unique identifier of the folder for which you want to retrieve bookmarks. This function fetches
 * bookmarks from the database based on the `user_id` and `folder_id` provided as parameters.
 * @returns The `fetchByFolderId` function returns a Promise that resolves to an array of
 * `BookmarkModel` objects. Each `BookmarkModel` object contains the properties `id`, `url`,
 * `image_id`, `folder_id`, and `title`. The bookmarks are filtered based on the `user_id`,
 * `folder_id`, and `isdeleted` criteria specified in the query.
 */
export const fetchByFolderId = async (user_id: number, folder_id: number): Promise<BookmarkModel[]> => {
    return await knex('bookmarks').select('id', 'url', 'image_id', 'folder_id', 'title', 'date').where('user_id', user_id).andWhere('folder_id', folder_id).andWhere('isdeleted', false);
}

/**
 * The function creates a new bookmark record in the database and returns the ID of the newly created
 * bookmark.
 * @param {BookmarkModel} bookmarkData - BookmarkModel is a type representing the data structure of a
 * bookmark. It likely includes properties such as title, url, description, and any other relevant
 * information about a bookmark.
 * @returns The `create` function is returning an object with a property `bookmarkId` that contains the
 * id of the newly inserted bookmark in the database.
 */
export const create = async (bookmarkData: BookmarkModel): Promise<{ bookmarkId: number }> => {
    const bookmark = await knex('bookmarks').insert(bookmarkData).returning('id');
    return { bookmarkId: bookmark[0].id }
}

/**
 * The function `updateTitle` updates a bookmark's data in the database based on the provided bookmark
 * ID.
 * @param {BookmarkModel} bookmarkData - BookmarkModel - an object containing data to update for a
 * bookmark
 * @param {number} bookmarkId - The `bookmarkId` parameter is the unique identifier of the bookmark
 * that you want to update in the database. It is used to locate the specific bookmark record that
 * needs to be updated.
 * @returns The `updateTitle` function is returning a promise that resolves to the result of updating
 * the `bookmarks` table in the database with the provided `bookmarkData` for the bookmark identified
 * by `bookmarkId`.
 */
export const updateTitle = async (bookmarkData: BookmarkModel, bookmarkId: number): Promise<number> => {
    return await knex('bookmarks').where('id', bookmarkId).update(bookmarkData);
}

/**
 * The function `remove` updates a bookmark record in the database based on the provided
 * `bookmarkData` object which is changed the isdeleted to true.
 * @param {BookmarkModel} bookmarkData - BookmarkModel
 * @returns The `remove` function is returning a promise that resolves to the result of updating the
 * `bookmarks` table in the database where the `id` matches the `id` of the `bookmarkData` object with
 * the values from the `bookmarkData` object which is to change the isdeleted to true.
 */
export const remove = async (bookmarkData: BookmarkModel) => {
    return await knex('bookmarks').where('id', bookmarkData.id).update(bookmarkData);
}

/**
 * This function removes bookmarks by setting their 'isdeleted' flag to true based on the provided
 * folderId.
 * @param {number} folderId - The `folderId` parameter is a number that represents the unique
 * identifier of the folder for which you want to remove bookmarks.
 * @returns The function `removeByFolderid` is returning a Promise that resolves to the result of
 * updating the `isdeleted` field to `true` for all bookmarks in the `bookmarks` table where the
 * `folder_id` matches the provided `folderId`.
 */
export const removeByFolderid = async (folderId: number) => {
    return await knex('bookmarks').where('folder_id', folderId).update('isdeleted', true);
}

export const fetchByTitle = async (title: string, folderId: number) => {
    return await knex('bookmarks').select('title', 'url').whereRaw('LOWER(title) LIKE LOWER(?)', [`%${title}%`]).andWhere('isdeleted', false).andWhere('folder_id', folderId)
}

export const sortBy = async (sortBy: string, userId: number, folder_id: number, sortOrder: string) => {
    return await knex('bookmarks').where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folder_id).orderBy(sortBy, sortOrder);
}




export const updateClickedDate = async (bookmarkData: BookmarkModel) => {
    return await knex('bookmarks').update(bookmarkData).where('id', bookmarkData.id)
}

export const removeRecentlyClickedBookmark = async (bookmarkData: BookmarkModel, user_id: number) => {
    return await knex('bookmarks').update(bookmarkData).where('user_id', user_id).andWhere('id', bookmarkData.id);
}

export const sortRecentlyClickedBookmarkBy = async (sortBy: string, userId: number, sortOrder: string) => {
    return await knex('bookmarks').where('user_id', userId).andWhere('isdeleted', false).andWhereNot('click_date', null).orderBy(sortBy, sortOrder);
}

export const filterRecentlyClickedBookmarksByChip = async (userId: number, chipId: number) => {
    return await knex('bookmarks').where('user_id', userId).where('chip_id', chipId).andWhere('isdeleted', false).andWhereNot('click_date', null);
}

export const fetchRecentlyClickedBookmarksByTittle = async (title: string) => {
    return await knex('bookmarks').select('title', 'url').whereRaw('LOWER(title) LIKE LOWER(?)', [`%${title}%`]).andWhere('isdeleted', false).andWhereNot('click_date', null);
}
