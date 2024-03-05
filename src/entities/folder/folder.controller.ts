import { Request, Response } from 'express'
import { FolderModel } from './folder.model'
import { addFolders, findAllFolders, findFolderById, removeFolder, updateFolder } from './folder.service'
import { uploadImage } from '../image/image.controller';
import { saveImage } from '../image/image.service';
import { folderExceptionMessages } from './constant/folderExceptionMessages';

/**
 * The function `getAllFolders` is an asynchronous function that retrieves all folders and sends the
 * result as a JSON response.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request method, headers, query parameters, and body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status, headers, and body. In this code snippet, it is used to send a JSON response with the status
 * code 200
 */
export const getAllFolders = async (req: Request, res: Response) => {
    try {
        const result: FolderModel[] = await findAllFolders(req.body.user.id);
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

/**
 * The `postFolders` function is an asynchronous function that handles the creation of folders,
 * including uploading an image if provided, and returns the result as a JSON response.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, and
 * request URL.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 */
export const postFolders = async (req: Request, res: Response) => {
    try {
        const { name, folder_id, user } = req.body;

        if (!name) {
            throw new Error(folderExceptionMessages.NAME_REQUIRED)
        }

        if (req.file) {
            const imagePath = req.file!.path;
            const imageUrl = await uploadImage(imagePath)

            const image = await saveImage({ url: imageUrl, type: 'folder', name: req.file.filename }, user.username)

            req.body.image_id = image.id;
        }

        const folderData: FolderModel = {
            name,
            user_id: user.id,
            image_id: req.body.image_id || 1,
            folder_id: folder_id || 0,
            created_by: user.username,
            updated_by: user.username,
        }

        const result = await addFolders(folderData)

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

/**
 * The function `patchFolders` is an asynchronous function that handles the patch request for updating
 * a folder's name and image.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, and other relevant details.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 */
export const patchFolders = async (req: Request, res: Response) => {
    try {
        const folderId: number = parseInt(req.params.id);
        if (!folderId) throw new Error(folderExceptionMessages.INVALID_ID);

        const { name, user } = req.body;

        if (!name) {
            throw new Error(folderExceptionMessages.NAME_REQUIRED)
        }

        if (req.file) {
            const imagePath = req.file!.path;
            const imageUrl = await uploadImage(imagePath)

            const image = await saveImage({ url: imageUrl, type: 'user', name: req.file.filename }, user.username)

            req.body.image_id = image.id;
        }

        const currentFolder: FolderModel = await findFolderById(folderId)
        const { image_id: curretImage } = currentFolder;

        const folderData: FolderModel = {
            ...currentFolder,
            name,
            image_id: req.body.image_id || curretImage,
            updated_by: user.username,
        }

        const result = await updateFolder(folderData, folderId);

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

/**
 * The function `deleteFolders` is an asynchronous function that handles the deletion of folders by
 * taking a request and response object as parameters.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body.
 */
export const deleteFolders = async (req: Request, res: Response) => {
    try {
        const folderId: number = parseInt(req.params.id);
        if (!folderId) throw new Error(folderExceptionMessages.INVALID_ID);

        const result = await removeFolder(folderId);

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}
