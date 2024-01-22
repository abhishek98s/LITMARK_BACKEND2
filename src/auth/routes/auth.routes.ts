import express from 'express';
import multer from 'multer';

const router = express.Router();
import { loginHandler, registerHandler } from '../controllers/authController';

const upload = multer({ dest: 'temp/' });

router.post('/register', upload.single('litmark_image'), registerHandler);
router.post('/login', loginHandler);

export default router;
