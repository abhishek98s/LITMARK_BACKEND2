import express from 'express';
import multer from 'multer'

import { deleteImage, getImage, patchImage, postImage } from './image.controller';
import { verifyToken } from '../../auth/middleware/authentication.middleware';
import joiValidationMiddleware from '../../auth/middleware/joiValidationMiddleware';
import imageSchema from './image.schema';
const router = express.Router();

const upload = multer({ dest: 'temp/' });

router.use(verifyToken);

router.get('/:id', getImage)
    .delete('/:id', deleteImage)
    .patch('/:id', upload.single('litmark_image'), verifyToken, patchImage);
router.post('/', upload.single('litmark_image'), joiValidationMiddleware(imageSchema), verifyToken, postImage);

export default router;
