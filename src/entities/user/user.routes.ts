import express from 'express';
import multer from 'multer'

import { deleteUser, getUser, postUser, patchUser } from './user.controller';
const router = express.Router();

const upload = multer({ dest: 'temp/' });

router.get('/:id', getUser)
    .patch('/:id', upload.single('litmark_image'), patchUser)
    .delete('/:id', deleteUser);
router.post('/', upload.single('litmark_image'), postUser);

export default router;
