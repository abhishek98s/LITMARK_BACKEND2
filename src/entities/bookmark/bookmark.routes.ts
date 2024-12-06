import express from 'express';
import multer from 'multer';
import { deleteBookmark, getBookmarks, patchBookmark, postBookmark, getBookmarksByFolderId, searchByTitle, getSortedData, addRecentBookmark, getRecentBookmarks, deleteRecentBookmark, sortRecentBookmark, filterRecentBookmark, searchRecentBookmark } from './bookmark.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import joiValidationMiddleware from '../../middleware/joiValidationMiddleware';
import bookmarkSchema from './bookmark.schema';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyToken);

router.get('/recent', getRecentBookmarks)
    .delete('/recent/:id', deleteRecentBookmark)
    .patch('/recent/:id', addRecentBookmark)
    .get('/recent/sort', sortRecentBookmark)
    .get('/recent/filter', filterRecentBookmark)
    .get('/recent/search', searchRecentBookmark);

router.get('/search', searchByTitle);
router.get('/sort', getSortedData);

router.get('/', getBookmarks)
    .get('/:folder_id', getBookmarksByFolderId)
    .post('/', joiValidationMiddleware(bookmarkSchema), verifyToken, postBookmark);

router.patch('/:id', upload.single('litmark_image'), verifyToken, patchBookmark)
    .delete('/:id', deleteBookmark);

export default router;
