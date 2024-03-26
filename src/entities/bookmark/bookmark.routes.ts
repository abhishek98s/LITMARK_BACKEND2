import express from 'express';
import multer from 'multer';
import { deleteBookmark, getBookmarks, patchBookmark, postBookmark, getBookmarksByFolderId, searchByTitle, getSortedData, addRecentBookmark, getRecentBookmarks, deleteRecentBookmark, sortRecentBookmark, filterRecentBookmark, searchRecentBookmark } from './bookmark.controller';
import { verifyToken } from '../../auth/middleware/authentication.middleware';
import joiValidationMiddleware from '../../auth/middleware/joiValidationMiddleware';
import bookmarkSchema from './bookmark.schema';

const router = express.Router();

const upload = multer({ dest: 'temp/' });

router.use(verifyToken);

router.get('/recent', getRecentBookmarks)
    .delete('/recent/:id', deleteRecentBookmark)
    .patch('/recent/:id', addRecentBookmark)
    .patch('/recent/:id', addRecentBookmark)
    .get('/recent/sort', sortRecentBookmark)
    .get('/recent/filter', filterRecentBookmark)
    .get('/recent/search', searchRecentBookmark)

router.get('/search', searchByTitle)
router.get('/sort', getSortedData)

router.get('/', getBookmarks)
    .get('/:folder_id', getBookmarksByFolderId)
    .post('/', joiValidationMiddleware(bookmarkSchema), verifyToken, postBookmark)

router.patch('/:id', upload.single('litmark_image'), verifyToken, patchBookmark)
    .delete('/:id', deleteBookmark)

export default router;
