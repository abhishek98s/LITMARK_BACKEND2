import express from 'express';
import { deleteBookmark, getBookmarks, patchBookmark, postBookmark, getBookmarksByFolderId } from './bookmark.controller';
import { verifyToken } from '../../auth/middleware/authentication.middleware';
import multer from 'multer';
import joiValidationMiddleware from '../../auth/middleware/joiValidationMiddleware';
import bookmarkSchema from './bookmark.schema';

const router = express.Router();

const upload = multer({ dest: 'temp/' });

router.use(verifyToken);

router.get('/', getBookmarks).get('/:folder_id', getBookmarksByFolderId).post('/', joiValidationMiddleware(bookmarkSchema), verifyToken, postBookmark)
router.patch('/:id', upload.single('litmark_image'), verifyToken, patchBookmark).delete('/:id', deleteBookmark)

export default router;
