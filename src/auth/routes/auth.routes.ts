import express from 'express';
import multer from 'multer';

import authSchema from '../schema/auth.schema';
import { loginHandler, registerHandler } from '../controllers/authController';
import joiValidationMiddleware from '../../middleware/joiValidationMiddleware';
import { routes } from '../../utils/routeConfig';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  routes.auth.register,
  upload.single('litmark_image'),
  joiValidationMiddleware(authSchema.register),
  registerHandler,
);
router.post(routes.auth.login, joiValidationMiddleware(authSchema.login), loginHandler);

export default router;
