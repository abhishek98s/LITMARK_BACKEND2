import knex from '../../config/knex.config'
import { folderExceptionMessages } from './constant/folderExceptionMessages';
import { FolderModel } from './folder.model'

/**
 * The function `findAllFolders` retrieves all folders from a database using Knex and returns them as
 * an array of `FolderModel` objects.
 * @returns an array of FolderModel objects.
 */
export const findAllFolders = async (user_id: number): Promise<FolderModel[]> => {
    const folders: FolderModel[] = await knex('folders').select('*').where('user_id', user_id).andWhere('folder_id', null).andWhere('isdeleted', false);
    if (!folders) throw new Error(folderExceptionMessages.FOLDER_EMPTY)

    return folders
}

export const findAllNestedFolders = async (user_id: number, parentFolderId: number): Promise<FolderModel[]> => {
    const folders: FolderModel[] = await knex('folders').select('*').where('user_id', user_id).andWhere('folder_id', parentFolderId).andWhere('isdeleted', false);
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
    const folder: FolderModel = await knex('folders').select('*').where('id', folderId).andWhere('isdeleted', false).first();
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
    const subfolders: FolderModel[] = await knex('folders').where('folder_id ', folderId);

    for (const subfolder of subfolders) {
        await removeFolder(subfolder.id!)
    }

    await knex('folders').where('id', folderId).update('isdeleted', true);
    await knex('bookmarks').where('folder_id', folderId).update('isdeleted', true);
    return
}

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
export const sortByDate = async (userId: number, folder_id: number, sortOrder: string) => {
    const sortedData = await knex('folders').orderBy('created_at', sortOrder).where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folder_id);
    if (sortedData.length === 0) throw new Error(folderExceptionMessages.FOLDER_EMPTY)
    return sortedData;
}

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
export const sortByAlphabet = async (userId: number, folder_id: number, sortOrder: string) => {
    const sortedData = await knex('folders').orderBy('name', sortOrder).where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folder_id);
    if (sortedData.length === 0) throw new Error(folderExceptionMessages.FOLDER_EMPTY)
    return sortedData;
}
