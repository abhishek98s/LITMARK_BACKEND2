import express from 'express';
import multer from 'multer';

const router = express.Router();
import { loginHandler, registerHandler } from '../controllers/authController';
import joiValidationMiddleware from '../middleware/joiValidationMiddleware';
import authSchema from '../schema/auth.schema';

const upload = multer({ dest: 'temp/' });

router.post('/register', upload.single('litmark_image'), joiValidationMiddleware(authSchema.register), registerHandler);
router.post('/login', joiValidationMiddleware(authSchema.login), loginHandler);

export default router;
