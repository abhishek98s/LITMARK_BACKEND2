import { Request, Response } from 'express';

import { BookmarkModel } from './bookmark.model';
import { addBookmark, findBookmarkById, findBookmarks, removeBookmark, updateBookmark } from './bookmark.service';
import { uploadImage, validateImageType } from '../image/image.controller';
import { saveImage } from '../image/image.service';
import { bookmarkExceptionMessages } from './constant/bookmarkExceptionMessages';

/**
 * The function `getBookmarks` is an asynchronous function that retrieves bookmarks and sends them as a
 * response in JSON format.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request headers, query parameters, request body, and
 * more.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the status
 * code, headers, and send the response body.
 */
export const getBookmarks = async (req: Request, res: Response) => {
    try {
        const result: BookmarkModel[] = await findBookmarks();

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

/**
 * The `postBookmark` function is an asynchronous function that handles the creation of a new bookmark,
 * including uploading an image if provided, and returns the created bookmark data.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 */
export const postBookmark = async (req: Request, res: Response) => {
    try {
        const { title, folder_id, chips_id, user } = req.body;

        if (!title || !folder_id) {
            throw new Error(bookmarkExceptionMessages.TITLE_FOLDER_REQUIRED)
        }

        if (req.file) {
            const imagePath = req.file.path;

            validateImageType(req.file.originalname)

            const imageUrl = await uploadImage(imagePath)

            const image = await saveImage({ url: imageUrl, type: 'bookmark', name: req.file.filename }, user.username)

            req.body.image_id = image.id;
        }

        const bookmarkData: BookmarkModel = {
            title,
            date: new Date(),
            image_id: req.body.image_id || 0,
            folder_id,
            chip_id: chips_id || 1,
            created_by: user.username,
            updated_by: user.username,
        }

        const result = await addBookmark(bookmarkData);

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

/**
 * The function `patchBookmark` updates a bookmark with the provided data, including the title and
 * image, and returns the updated bookmark.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request parameters, etc.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status, headers, and body. In this code snippet, it is used to send a JSON response with the updated
 * bookmark data or
 */
export const patchBookmark = async (req: Request, res: Response) => {
    try {
        const bookmarkId = parseInt(req.params.id);

        if (!bookmarkId) {
            throw new Error(bookmarkExceptionMessages.INVALID_ID)
        }

        const { title, user } = req.body;
        
        if (!title) {
            throw new Error(bookmarkExceptionMessages.TITLE_REQUIRED)
        }

        const currentBookmark = await findBookmarkById(bookmarkId);
        const { image_id: currentBookmarkImage } = currentBookmark;

        if (req.file) {
            const imagePath = req.file!.path;
            const imageUrl = await uploadImage(imagePath)

            const image = await saveImage({ url: imageUrl, type: 'bookmark', name: req.file.filename }, user.username)

            req.body.image_id = image.id;
        }

        const bookmarkData: BookmarkModel = {
            ...currentBookmark,
            title,
            image_id: req.body.image_id || currentBookmarkImage,
            updated_by: user.username,
        }

        const result = await updateBookmark(bookmarkData, bookmarkId);

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

/**
 * The function `deleteBookmark` is an asynchronous function that handles the deletion of a bookmark by
 * its ID and returns a JSON response with the result.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the status
 * code, headers, and send the response body.
 */
export const deleteBookmark = async (req: Request, res: Response) => {
    try {
        const bookmarkId = parseInt(req.params.id);

        if (!bookmarkId) {
            throw new Error(bookmarkExceptionMessages.INVALID_ID)
        }

        const result = await removeBookmark(bookmarkId);

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}
