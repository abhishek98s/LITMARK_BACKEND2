import express from 'express';
import multer from 'multer'

import { deleteUser, getUser, postUser, patchUser } from './user.controller';
import { verifyToken } from '../../auth/middleware/authentication.middleware';
const router = express.Router();

const upload = multer({ dest: 'temp/' });

router.use(verifyToken)

router.get('/:id', getUser)
    .patch('/:id', upload.single('litmark_image'), patchUser)
    .delete('/:id', deleteUser);
router.post('/', upload.single('litmark_image'), postUser);

export default router;
