import knex from '../../config/knex.config'
import { FolderModel } from './folder.model';

/**
 * This function fetches all parent folders belonging to a specific user that are not deleted.
 * @param {number} user_id - The `user_id` parameter is used to specify the user for whom we want to
 * fetch all parent folders.
 * @returns The `fetchAllParent` function is returning a Promise that resolves to an array of objects
 * representing folders that belong to a specific user and have no parent folder. Each object in the
 * array contains the properties 'id', 'name', 'image_id', 'user_id', and 'folder_id' of the folder.
 */
export const fetchAllParent = async (user_id: number): Promise<FolderModel[]> => {
    return knex('folders').select('id', 'name', 'image_id', 'user_id', 'folder_id').where('user_id', user_id).andWhere('folder_id', null).andWhere('isdeleted', false);
}

/**
 * The function fetches all nested folders belonging to a specific user within a parent folder.
 * @param {number} user_id - The `user_id` parameter is a number that represents the unique identifier
 * of the user for whom we want to fetch nested folders.
 * @param {number} parentFolderId - The `parentFolderId` parameter represents the ID of the parent
 * folder for which you want to fetch all nested folders. This function will retrieve all folders that
 * are nested within the specified parent folder ID for a given user ID.
 * @returns The function `fetchAllNested` returns a Promise that resolves to an array of `FolderModel`
 * objects. Each `FolderModel` object contains the properties `id`, `name`, `image_id`, `user_id`, and
 * `folder_id`. The folders are filtered based on the `user_id`, `parentFolderId`, and `isdeleted`
 * conditions specified in the `knex` query.
 */
export const fetchAllNested = async (user_id: number, parentFolderId: number): Promise<FolderModel[]> => {
    return await knex('folders').select('id', 'name', 'image_id', 'user_id', 'folder_id').where('user_id', user_id).andWhere('folder_id', parentFolderId).andWhere('isdeleted', false);
}

/**
 * This TypeScript function fetches a folder by its ID from a database table called 'folders' while
 * ensuring it is not marked as deleted.
 * @param {number} folderId - The `folderId` parameter is a number that represents the unique
 * identifier of a folder in the database. The function `fetchById` is an asynchronous function that
 * retrieves folder information based on the provided `folderId`. It uses the `knex` library to
 * interact with the database and fetches the
 * @returns The `fetchById` function is returning a Promise that resolves to a `FolderModel` object.
 * The function queries the database table 'folders' to select specific columns ('id', 'name',
 * 'image_id', 'user_id', 'folder_id') based on the provided `folderId`. It also includes a condition
 * to only select rows where the 'isdeleted' column is false. The `
 */
export const fetchById = async (folderId: number): Promise<FolderModel> => {
    return await knex('folders').select('id', 'name', 'image_id', 'user_id', 'folder_id').where('id', folderId).andWhere('isdeleted', false).first();
}

/**
 * This function fetches all folder models by folder ID asynchronously.
 * @param {number} folderId - The `folderId` parameter is a number that represents the unique
 * identifier of a folder.
 * @returns An array of `FolderModel` objects that match the provided `folderId` from the `folders`
 * table in the database.
 */
export const fetchAllByFolderId = async (folderId: number): Promise<FolderModel[]> => {
    return await knex('folders').where('folder_id ', folderId);
}

/**
 * The function creates a new folder record in a database table and returns the ID of the newly created
 * folder.
 * @param {FolderModel} folderData - `folderData` is an object of type `FolderModel` containing data
 * for creating a new folder.
 * @returns The function `create` is returning an object with a property `folder_Id` that contains the
 * id of the newly inserted folder in the database.
 */
export const create = async (folderData: FolderModel): Promise<{ folder_Id: number }> => {
    const folder = await knex('folders').insert(folderData).returning('id');
    return { folder_Id: folder[0].id };
}

export const update = async (folderData: FolderModel, folderId: number): Promise<{ id: number }> => {
    return await knex('folders').where('id', folderId).update(folderData);
}

export const remove = async (folderId: number) => {
    return await knex('folders').where('id', folderId).update('isdeleted', true);
}

export const sortBy = async (sortBy: string, userId: number, folderId: number, sortOrder: string) => {
    return await knex('folders').orderBy(sortBy, sortOrder).where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folderId);
}