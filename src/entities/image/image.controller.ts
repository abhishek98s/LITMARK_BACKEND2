import { Request, Response } from 'express';
import { findImage, removeImage, saveImage, updateImage } from './image.service';
import { ImageModel } from './image.model';
// import cloudinary from '../../utils/imageUploader';

const isValidType = ({ type }: ImageModel) => {
    const reg: RegExp = new RegExp(/\b(?:folder|user|bookmark)\b/i);
    const isNameValid = reg.test(type);
    if (!isNameValid) throw new Error('Type should be user, bookmark or folder');
    return true;
}

export const uploadImage = async (imgPath: string) => {
    // const imgUrl = (await cloudinary.v2.uploader.upload(imgPath, { folder: 'litmark' })).secure_url;
    const imgUrl = imgPath || 'https://sre.im/gale/tep.png';   //dummy url

    if (!imgUrl) throw new Error('Failed to upload image');

    return imgUrl;
}

const validateImageType = (fileName: string) => {
    const imageType = fileName.split('.').pop() as string;

    const reg: RegExp = new RegExp(/\b(?:png|jpg|jpeg|gif)\b/i);
    const isValidType = reg.test(imageType);

    if (!isValidType) throw new Error('Image type is not valid. Please use jpg, jpeg, gif or png formar');
    return;
}

export const getImage = async (req: Request, res: Response) => {
    try {
        const imageId: number = parseInt(req.params.id);
        if (!imageId) throw new Error('id not valid');

        const result = await findImage(imageId);
        if (!result) throw new Error('Image doesnot exist');

        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}


export const postImage = async (req: Request, res: Response) => {
    try {
        const imgPath = req.file!.path;

        req.body.url = await uploadImage(imgPath)
        const { url, type, name } = req.body;

        if (!url || !type || !name) throw new Error('url, type or name properties is required');

        isValidType(req.body);
        validateImageType(req.file!.originalname)

        const result = await saveImage({ type, url, name });

        res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}


export const patchImage = async (req: Request, res: Response) => {
    try {
        const imageId: number = parseInt(req.params.id);
        const currentImageData = await findImage(imageId);
        
        if (req.file) {
            const imgPath = req.file!.path;
            req.body.url = await uploadImage(imgPath)
        }

        isValidType(req.body);

        const result = await updateImage({ ...currentImageData, ...req.body }, imageId)

        res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}


export const deleteImage = async (req: Request, res: Response) => {
    try {
        const imageId: number = parseInt(req.params.id);
        if (!imageId) throw new Error('id not valid');

        const result = await removeImage(imageId);

        res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}
