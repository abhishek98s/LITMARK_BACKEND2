import express from 'express';
import { deleteFolders, getAllFolders, patchFolders, postFolders } from './folder.controller';
import { verifyToken } from '../../auth/middleware/authentication.middleware';
import multer from 'multer';
import joiValidationMiddleware from '../../auth/middleware/joiValidationMiddleware';
import folderSchema from './folder.schema';

const router = express.Router();

const upload = multer({ dest: 'temp/' });

router.use(verifyToken)

router.get('/', getAllFolders).post('/', upload.single('litmark_image'), joiValidationMiddleware(folderSchema), verifyToken, postFolders)
router.patch('/:id', upload.single('litmark_image'), verifyToken, patchFolders).delete('/:id', deleteFolders)

export default router;
