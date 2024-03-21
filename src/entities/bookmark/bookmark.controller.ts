import { Request, Response } from 'express';
import dotenv from 'dotenv'
import crypto from 'crypto';

import { BookmarkModel } from './bookmark.model';
import { addBookmark, findBookmarkById, findBookmarks, findBookmarksByFolderId, findRecentClickedBookmarks, getBookmarksByTitle, removeBookmark, sortByAlphabet, sortByDate, updateBookmark, updateClickedDate } from './bookmark.service';
import { uploadImage } from '../image/image.controller';
import { saveImage } from '../image/image.service';
import { bookmarkExceptionMessages } from './constant/bookmarkExceptionMessages';
import { addChip } from '../chip/chip.service';
import { findFolderById } from '../folder/folder.service';
import { FolderModel } from '../folder/folder.model';
import { ChipModel } from '../chip/chip.model';
import { logger } from '../../logger/logger';

dotenv.config()

/**
 * The function `getHostnameFromUrl` extracts the hostname from a given URL string.
 * @param {string} url - The `getHostnameFromUrl` function takes a URL string as input and extracts the
 * hostname from it. The hostname is the part of the URL that identifies the domain or server.
 * @returns The function `getHostnameFromUrl` returns the hostname extracted from the provided URL.
 */
export const getHostnameFromUrl = (url: string) => {
    const pattern = /https?:\/\/(?:www\.)?([^/?]+)/i;
    const match = url.match(pattern);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

/**
 * The function `getTitleFromURL` fetches the title of a webpage using Google Custom Search API based
 * on the provided URL.
 * @param {string} url - The `url` parameter in the `getTitleFromURL` function is a string representing
 * the URL from which you want to extract the title.
 * @returns The function `getTitleFromURL` is returning the title of the first search result from the
 * Google Custom Search API based on the provided URL. If there is an error during the API call, it
 * will return the hostname extracted from the URL using the `getHostnameFromUrl` function.
 */
async function getTitleFromURL(url: string) {
    try {
        const searchAPIKey = 'AIzaSyDvFPrz3tL8mXR3_ezMcdYeDMbbZk3hLLE';
        const searchID = '2340c7cfc09cf440b';

        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${searchAPIKey}&cx=${searchID}&q=${url}`);
        const data = await response.json();

        const title = data.items[0].title;
        return title;
    } catch (error) {
        return getHostnameFromUrl(url);
    }
}

/**
 * The function `getThumbnailFromURL` fetches a thumbnail image from a URL using the Google Custom
 * Search API, or returns a favicon image if an error occurs.
 * @param {string} url - The `url` parameter in the `getThumbnailFromURL` function is a string
 * representing the URL of a webpage from which you want to retrieve a thumbnail image.
 * @returns The function `getThumbnailFromURL` is returning either the thumbnail image URL extracted
 * from the Google Custom Search API response based on the input URL, or a Google favicon URL if there
 * is an error during the API call.
 */
async function getThumbnailFromURL(url: string) {
    try {
        const searchAPIKey = 'AIzaSyDvFPrz3tL8mXR3_ezMcdYeDMbbZk3hLLE';
        const searchID = '2340c7cfc09cf440b';

        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${searchAPIKey}&cx=${searchID}&q=${url}`);
        const data = await response.json();

        const thumbnail = data.items[0].pagemap.cse_thumbnail[0].src;
        return thumbnail;
    } catch (error) {
        const favicon = `https://www.google.com/s2/favicons?domain=${getHostnameFromUrl(url)}&sz=256`
        return favicon;
    }
}

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
        const { user } = req.body;

        const result: BookmarkModel[] = await findBookmarks(user.id);

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

/**
 * The function `getBookmarksByFolderId` retrieves bookmarks by folder ID for a specific user and sends
 * the result as a JSON response.
 * @param {Request} req - The `req` parameter in the `getBookmarksByFolderId` function stands for the
 * HTTP request object. It contains information about the incoming request such as headers, parameters,
 * body, etc. This parameter is of type `Request` which is typically provided by web frameworks like
 * Express.js in Node
 * @param {Response} res - The `res` parameter in the `getBookmarksByFolderId` function is an instance
 * of the Express Response object. It is used to send a response back to the client making the request.
 * In this function, we are using `res` to send a JSON response with the bookmarks data or
 */
export const getBookmarksByFolderId = async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        const folder_id = parseInt(req.params.folder_id);

        const result: BookmarkModel[] = await findBookmarksByFolderId(user.id, folder_id);

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
        const { url, folder_id, user } = req.body;

        if (!url || !folder_id) {
            throw new Error(bookmarkExceptionMessages.LINK_FOLDER_REQUIRED)
        }

        const isFolder: FolderModel = await findFolderById(folder_id);
        if (!isFolder) throw new Error('Folder does\'nt exist.')

        const imageName = crypto.randomUUID();
        const imageUrl = await getThumbnailFromURL(url);
        const imageFromDB = await saveImage({ url: imageUrl, type: 'bookmark', name: imageName, isdeleted: false }, user.username)

        const chipData = {
            name: isFolder.name,
            user_id: user.id,
            folder_id,
            isdeleted: false,
            created_by: user.username,
            updated_by: user.username,
        }
        const chip: ChipModel = await addChip(chipData)

        const bookmarkData: BookmarkModel = {
            url,
            folder_id,
            title: await getTitleFromURL(url),
            image_id: imageFromDB.id || 1,
            chip_id: chip.id || 1,
            user_id: user.id,
            date: new Date(),
            isdeleted: false,
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

            const image = await saveImage({ url: imageUrl, type: 'bookmark', name: req.file.filename, isdeleted: false }, user.username)

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

/**

 * This TypeScript function searches for bookmarks by title and returns the results in a JSON format,
 * handling errors appropriately.
 * @param {Request} req - Request object containing information about the HTTP request
 * @param {Response} res - The `res` parameter in the `searchByTitle` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by a web framework like Express in Node.js. This object
 * allows you to send data back to
 */

export const searchByTitle = async (req: Request, res: Response) => {
    try {
        const title: string = req.query.title as string;
        const folder_id: number = req.query.folder_id as unknown as number;

        if (!title) {
            throw new Error(bookmarkExceptionMessages.SEARCH_QUERY_EMPTY)
        }

        const result = await getBookmarksByTitle(title!, folder_id!);
        logger.error(result)


        res.status(200).json({ data: result })
    } catch (error) {
        console.log(error)
    }
}
/*
 * The function `getSortedData` in TypeScript fetches and sorts data based on specified criteria like
 * date or alphabet for a given user and folder.
 * @param {Request} req - The `req` parameter in the `getSortedData` function represents the request
 * object, which contains information about the HTTP request that was made. This object includes
 * properties such as `query` (for query parameters), `body` (for request body data), `params` (for
 * route parameters),
 * @param {Response} res - The `res` parameter in the `getSortedData` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by a web framework like Express in Node.js. The `res` object
 * has methods like `
 */
export const getSortedData = async (req: Request, res: Response) => {
    try {
        const sortBy = req.query.sort as string;
        const folder_id = req.query.folder_id as unknown as number;
        const sortOrder = req.query.order as string || 'asc';

        const { user } = req.body;

        let result;

        switch (sortBy) {
            case 'date':
                result = await sortByDate(user.id, folder_id, sortOrder);
                break;
            case 'alphabet':
                result = await sortByAlphabet(user.id, folder_id, sortOrder);
                break;
            default:
                new Error(bookmarkExceptionMessages.INVALID_DATA);
                break;
        }
        res.status(200).json({ data: result })

    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

export const getRecentBookmarks = async (req: Request, res: Response) => {
    try {
        const { user } = req.body;

        const result = await findRecentClickedBookmarks(user.id);

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}
/**
 * The function `bookmarkClick` updates the click_date of a bookmark based on the provided ID.
 * @param {Request} req - The `req` parameter in the `bookmarkClick` function is of type `Request`,
 * which is typically used to represent the HTTP request in Express.js or other Node.js frameworks. It
 * contains information about the incoming request such as headers, parameters, body, etc. You can
 * access specific data from the
 * @param {Response} res - The `res` parameter in the `bookmarkClick` function is an object
 * representing the HTTP response that the function will send back to the client. It is of type
 * `Response`, which is typically provided by a web framework like Express in Node.js. The `res` object
 * has methods like `status
 */
export const bookmarkClick = async (req: Request, res: Response) => {
    try {
        const bookmarkId = parseInt(req.params.id);

        if (!bookmarkId) {
            throw new Error(bookmarkExceptionMessages.INVALID_ID)
        }

        const isBookmarkPresent = await findBookmarkById(bookmarkId);

        await updateClickedDate({ ...isBookmarkPresent, click_date: new Date() });

        res.status(200).json({ data: { msg: 'Bookmark date updated.' } })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}
