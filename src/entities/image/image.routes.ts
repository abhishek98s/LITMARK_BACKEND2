import express from 'express';
import multer from 'multer';

import {
  deleteImage,
  getImage,
  patchImage,
  postImage,
} from './image.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import joiValidationMiddleware from '../../middleware/joiValidationMiddleware';
import imageSchema from './image.schema';
import { routes } from '../../utils/routeConfig';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyToken);

router
  .get(routes.image.byId, getImage)
  .delete(routes.image.byId, deleteImage)
  .patch(routes.image.byId, upload.single('litmark_image'), verifyToken, patchImage);
router.post(
  routes.image.root,
  upload.single('litmark_image'),
  joiValidationMiddleware(imageSchema),
  verifyToken,
  postImage,
);

export default router;
