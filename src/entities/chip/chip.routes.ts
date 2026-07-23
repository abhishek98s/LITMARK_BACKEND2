import express from 'express';
import {
  deleteChip,
  getAllChips,
  patchChip,
  postChip,
} from './chip.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import joiValidationMiddleware from '../../middleware/joiValidationMiddleware';
import chipSchema from './chip.schema';
import { routes } from '../../utils/routeConfig';

const router = express.Router();

router.use(verifyToken);

router
  .get(routes.chip.root, getAllChips)
  .post(routes.chip.root, joiValidationMiddleware(chipSchema), postChip)
  .patch(routes.chip.byId, patchChip)
  .delete(routes.chip.byId, deleteChip);

export default router;
