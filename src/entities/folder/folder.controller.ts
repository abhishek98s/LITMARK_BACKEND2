import { Request, Response } from 'express'
import { FolderModel } from './folder.model'
import { addFolders, findAllFolders, findAllNestedFolders, findFolderById, removeFolder, updateFolder } from './folder.service'
import { uploadImage } from '../image/image.controller';
import { findImage, saveImage } from '../image/image.service';
import { folderExceptionMessages } from './constant/folderExceptionMessages';
import crypto from 'crypto';

const isImage = async (username: string) => {
    try {
        await findImage(1);
        return 1

    } catch (error) {
        const imageName = crypto.randomUUID();
        const image = await saveImage({ type: 'folder', url: 'https://res.cloudinary.com/dxsqdqnoe/image/upload/v1709878273/litmark/xo5sncdhybhemuvacf4u.png', name: imageName }, username)
        return image.id!;
    }
}

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
export const getAllTopFolders = async (req: Request, res: Response) => {
    try {
        const result: FolderModel[] = await findAllFolders(req.body.user.id);
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

/**
 * The function `getAllnestedFolders` retrieves all nested folders for a given parent folder ID and
 * returns the result in a JSON response.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `getAllnestedFolders` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by web frameworks like Express in Node.js. The `res` object
 * has methods like `status
 */
export const getAllnestedFolders = async (req: Request, res: Response) => {
    try {
        const parentFolderId: number = parseInt(req.params.id);
        const result: FolderModel[] = await findAllNestedFolders(req.body.user.id, parentFolderId);
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
            image_id: await isImage(user.username),
            folder_id: folder_id || null,
            isdeleted: false,
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
