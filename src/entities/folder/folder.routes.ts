import express from 'express';
import {
  deleteFolders,
  getAllTopFolders,
  getAllnestedFolders,
  patchFolders,
  postFolders,
  getSortedFolders,
} from './folder.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import multer from 'multer';
import joiValidationMiddleware, {
  joiQueryValidationMiddleware,
} from '../../middleware/joiValidationMiddleware';
import folderSchema, {
  folderPatchSchema,
  folderQuerySchema,
} from './folder.schema';
import { routes } from '../../utils/routeConfig';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyToken);
router.get(
  routes.folder.sort,
  joiQueryValidationMiddleware(folderQuerySchema),
  getSortedFolders,
);
router
  .get(routes.folder.root, getAllTopFolders)
  .get(routes.folder.byId, getAllnestedFolders)
  .post(routes.folder.root, joiValidationMiddleware(folderSchema), verifyToken, postFolders);
router
  .patch(
    routes.folder.byId,
    upload.single('litmark_image'),
    joiValidationMiddleware(folderPatchSchema),
    verifyToken,
    patchFolders,
  )
  .delete(routes.folder.byId, deleteFolders);

export default router;
