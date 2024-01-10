import express from 'express';
import multer from 'multer'
import { deleteImage, getImage, patchImage, postImage } from './image.controller';
const router = express.Router();

const upload = multer({ dest: 'temp/' });

router.get('/:id', getImage)
    .delete('/:id', deleteImage)
    .patch('/:id', upload.single('litmark_image'), patchImage);
router.post('/', upload.single('litmark_image'), postImage);

export default router;
