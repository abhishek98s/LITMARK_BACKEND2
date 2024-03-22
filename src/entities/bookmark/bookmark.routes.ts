import express from 'express';
import multer from 'multer';
import { deleteBookmark, getBookmarks, patchBookmark, postBookmark, getBookmarksByFolderId, searchByTitle, getSortedData, bookmarkClick, getRecentBookmarks, deleteRecentBookmark } from './bookmark.controller';
import { verifyToken } from '../../auth/middleware/authentication.middleware';
import joiValidationMiddleware from '../../auth/middleware/joiValidationMiddleware';
import bookmarkSchema from './bookmark.schema';

const router = express.Router();

const upload = multer({ dest: 'temp/' });

router.use(verifyToken);

router.get('/search', searchByTitle)
router.get('/sort', getSortedData)

router.get('/recent', getRecentBookmarks)
router.get('/recent', getRecentBookmarks).delete('/recent/:id', deleteRecentBookmark)

router.get('/', getBookmarks).get('/:folder_id', getBookmarksByFolderId).post('/', joiValidationMiddleware(bookmarkSchema), verifyToken, postBookmark)
router.patch('/:id', upload.single('litmark_image'), verifyToken, patchBookmark).delete('/:id', deleteBookmark)
router.patch('/click/:id', bookmarkClick)


export default router;
