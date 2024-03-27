import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import { findUserByEmail, register } from '../services/authService';
import { uploadImage } from '../../entities/image/image.controller';
import { saveImage } from '../../entities/image/image.service';
import { authExceptionMessages } from '../constant/authExceptionMessages';

export const loginHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error(authExceptionMessages.EMAIL_PASS_REQUIRED)
        }

        const user = await findUserByEmail(email);

        const { username, id, email: dBEmail } = user;

        const passordMatched: boolean = await bcrypt.compare(password, user.password);

        if (!passordMatched) {
            throw new Error(authExceptionMessages.INVALID_ID_CREDENTIALS)
        }

        const token = jwt.sign({ username, id, email:dBEmail }, process.env.JWT_TOKEN as string);

        res.status(200).json({ data: token });
    } catch (error: unknown) {
        res.status(500).json({ msg: (error as Error).message });
    }
}

export const registerHandler = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body

        if (!username || !email || !password) {
            throw new Error(authExceptionMessages.USER_CREDENTIALS)
        }

        if (!(validator.isEmail(email))) {
            throw new Error(authExceptionMessages.INVALID_EMAIL)
        }
        if (!(validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }))) {
            throw new Error(authExceptionMessages.PASS_VALIDATION)
        }
        if (!role) {
            req.body.role = 'normal';
        }
        if (req.file) {
            const imagePath = req.file!.path;
            const imageUrl = await uploadImage(imagePath)
            const imageName = req.file.filename;

            const image = await saveImage({ url: imageUrl, type: 'user', name: imageName, isdeleted: false }, username)
            req.body.image_id = image.id;
        } else {
            req.body.image_id = 0;
        }

        const savedUser = await register({
            username,
            email,
            password,
            role: req.body.role,
            isdeleted: false,
            image_id: req.body.image_id,
            created_by: username,
            updated_by: username,
        });

        res.json({ data: savedUser })
    } catch (error: unknown) {
        res.status(500).json({ msg: (error as Error).message })
    }
}
