import knex from '../../config/knex.config'
import { folderExceptionMessages } from './constant/folderExceptionMessages';
import { FolderModel } from './folder.model'

/**
 * The function `findAllFolders` retrieves all folders from a database using Knex and returns them as
 * an array of `FolderModel` objects.
 * @returns an array of FolderModel objects.
 */
export const findAllFolders = async (user_id: number): Promise<FolderModel[]> => {
    const folders: FolderModel[] = await knex('folders').select('*').where('user_id', user_id).andWhere('folder_id', null);
    if (!folders) throw new Error(folderExceptionMessages.FOLDER_EMPTY)

    return folders
}

export const findAllNestedFolders = async (user_id: number, parentFolderId: number): Promise<FolderModel[]> => {
    const folders: FolderModel[] = await knex('folders').select('*').where('user_id', user_id).andWhere('folder_id', parentFolderId);
    if (!folders) throw new Error(folderExceptionMessages.FOLDER_EMPTY)

    return folders
}

/**
 * The function `findFolderById` is an asynchronous function that retrieves a folder by its ID from a
 * database using Knex and returns it.
 * @param {number} folderId - The `folderId` parameter is the unique identifier of the folder you want
 * to find. It is of type `number`.
 * @returns a Promise that resolves to a FolderModel object.
 */
export const findFolderById = async (folderId: number): Promise<FolderModel> => {
    const folder: FolderModel = await knex('folders').select('*').where('id', folderId).first();
    if (!folder) throw new Error(folderExceptionMessages.FOLDER_NOT_FOUND);

    return folder;
}

/**
 * The function `addFolders` inserts folder data into a database table and returns the inserted folder.
 * @param {FolderModel} folderData - The `folderData` parameter is an object of type `FolderModel` that
 * contains the data for the folder to be added.
 * @returns the inserted folder data.
 */
export const addFolders = async (folderData: FolderModel) => {
    const folder = await knex('folders').insert(folderData);
    if (!folder) throw new Error(folderExceptionMessages.ADD_FAILED)

    const [folder_Id] = folder;

    return await findFolderById(folder_Id);
}

/**
 * The function updates a folder in a database using the provided folder data and folder ID.
 * @param {FolderModel} folderData - The `folderData` parameter is an object that represents the
 * updated data for the folder. It should contain the properties and values that need to be updated in
 * the folder record in the database.
 * @param {number} folderId - The `folderId` parameter is the unique identifier of the folder that
 * needs to be updated. It is of type `number`.
 * @returns the updated folder data.
 */
export const updateFolder = async (folderData: FolderModel, folderId: number) => {
    const folder = await knex('folders').where('id', folderId).update(folderData);
    if (!folder) throw new Error(folderExceptionMessages.UPDATE_FOLDER)

    return await findFolderById(folderId);
}

/**
 * The function removes a folder from a database based on its ID.
 * @param {number} folderId - The `folderId` parameter is the unique identifier of the folder that
 * needs to be removed.
 * @returns the deleted folder.
 */
export const removeFolder = async (folderId: number) => {
    const currentFolder = await findFolderById(folderId)
    if (!currentFolder) throw new Error(folderExceptionMessages.REMOVE_FAILED)

    const folder: FolderModel = await knex('folders').select('*').where('id', folderId).del();
    if (!folder) throw new Error('Failed to delete folder')

    return currentFolder;
}
