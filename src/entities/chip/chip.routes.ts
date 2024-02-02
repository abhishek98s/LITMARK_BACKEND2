import express from 'express';
import { deleteChip, getAllChips, patchChip, postChip } from './chip.controller';
import { verifyToken } from '../../auth/middleware/authentication.middleware';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAllChips)
    .post('/', postChip)
    .patch('/:id', patchChip)
    .delete('/:id', deleteChip);

export default router
