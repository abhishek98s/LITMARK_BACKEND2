import { Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { findImage, removeImage, saveImage, updateImage } from './image.service';
import { ImageModel } from './image.model';
import { imageExceptionMessages } from './constant/imageExceptionMessages';
import cloudinary from '../../utils/imageUploader';

export const isValidType = ({ type }: ImageModel) => {
    const reg: RegExp = new RegExp(/\b(?:folder|user|bookmark)\b/i);
    const isNameValid = reg.test(type);
    if (!isNameValid) throw new Error(imageExceptionMessages.INVALID_TYPE);
    return true;
}

export const uploadImage = async (imgPath: string) => {
    const imgUrl = (await cloudinary.v2.uploader.upload(imgPath, { folder: 'litmark' })).secure_url;
    if (!imgUrl) throw new Error(imageExceptionMessages.UPLOAD_FAILED);

    return imgUrl;
}

export const validateImageType = (fileName: string) => {
    const imageType = fileName.split('.').pop() as string;

    const reg: RegExp = new RegExp(/\b(?:png|jpg|jpeg|gif)\b/i);
    const isValidType = reg.test(imageType);

    if (!isValidType) throw new Error(imageExceptionMessages.INVALID_IMAGE_TYPE);
    return;
}

export const getImage = async (req: Request, res: Response) => {
    try {
        const imageId: number = parseInt(req.params.id);
        if (!imageId) throw new Error(imageExceptionMessages.INVALID_ID);

        const result = await findImage(imageId);
        if (!result) throw new Error(imageExceptionMessages.IMAGE_NOT_FOUND);

        return res.status(StatusCodes.OK).json({ data: result })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: (error as Error).message, error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
}

export const postImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new Error(imageExceptionMessages.FILE_REQUIRED)
        }
        const imgPath = req.file!.path;

        req.body.url = await uploadImage(imgPath);
        req.body.name = req.file?.filename;

        const { url, type, name, user } = req.body;

        if (!type) throw new Error(imageExceptionMessages.TYPE_REQUIRED);

        isValidType(req.body);
        validateImageType(req.file!.originalname)

        const result = await saveImage({ type, url, name }, user.username);

        res.status(StatusCodes.OK).json({ data: result })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: (error as Error).message, error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
}

export const patchImage = async (req: Request, res: Response) => {
    try {
        const imageId: number = parseInt(req.params.id);

        const { url, type, name, user } = req.body;

        if (!url && !type && !name) throw new Error(imageExceptionMessages.URL_TYPE_NAME_REQUIRED);

        isValidType(req.body);

        if (req.file) {
            const imgPath = req.file!.path;
            req.body.url = await uploadImage(imgPath)
        }

        const result: ImageModel = await updateImage({ url, type, name }, imageId, user.id)

        res.status(StatusCodes.OK).json({ data: result })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: (error as Error).message, error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
}

export const deleteImage = async (req: Request, res: Response) => {
    try {
        const imageId: number = parseInt(req.params.id);
        if (!imageId) throw new Error(imageExceptionMessages.INVALID_ID);

        const result = await removeImage(imageId);

        res.status(StatusCodes.OK).json({ data: result })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: (error as Error).message, error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
}
