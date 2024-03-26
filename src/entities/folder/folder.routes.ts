import express from 'express';
import { deleteFolders, getAllTopFolders, getAllnestedFolders, patchFolders, postFolders, getSortedFolders } from './folder.controller';
import { verifyToken } from '../../auth/middleware/authentication.middleware';
import multer from 'multer';
import joiValidationMiddleware from '../../auth/middleware/joiValidationMiddleware';
import folderSchema from './folder.schema';

const router = express.Router();

const upload = multer({ dest: 'temp/' });

router.use(verifyToken)
router.get('/sort', getSortedFolders)
router.get('/', getAllTopFolders).get('/:id', getAllnestedFolders).post('/', joiValidationMiddleware(folderSchema), verifyToken, postFolders)
router.patch('/:id', upload.single('litmark_image'), verifyToken, patchFolders).delete('/:id', deleteFolders)

export default router;
