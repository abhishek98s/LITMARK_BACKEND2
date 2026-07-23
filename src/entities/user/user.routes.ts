import express from 'express';
import multer from 'multer';

import { deleteUser, getUser, postUser, patchUser } from './user.controller';
import { verifyToken } from '../../middleware/authentication.middleware';
import joiValidationMiddleware from '../../middleware/joiValidationMiddleware';
import userSchema, { patchUserSchema } from './user.schema';
import { routes } from '../../utils/routeConfig';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyToken);

router
  .get(routes.user.byId, getUser)
  .patch(
    routes.user.byId,
    upload.single('litmark_image'),
    joiValidationMiddleware(patchUserSchema),
    patchUser,
  )
  .delete(routes.user.byId, deleteUser);
router.post(
  routes.user.root,
  upload.single('litmark_image'),
  joiValidationMiddleware(userSchema),
  postUser,
);

export default router;
