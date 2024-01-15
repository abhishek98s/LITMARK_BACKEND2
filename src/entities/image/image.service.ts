import knex from '../../config/knex.config';
import { imageExceptionMessages } from './constant/imageExceptionMessages';
import { ImageModel } from './image.model';

export const findImage = async (imageId: number): Promise<ImageModel> => {
    const image: ImageModel = await knex('images').select().where('id', imageId).first();
    if (!image) throw new Error(imageExceptionMessages.IMAGE_NOT_FOUND)

    return image;
}

export const saveImage = async (imageData: ImageModel, username: string) => {
    const newImage: ImageModel = {
        ...imageData,
        created_by: username,
        updated_by: username,
    }
    return await knex('images').insert(newImage);
}

export const updateImage = async (newImageData: ImageModel, imageId: number, username: string): Promise<ImageModel> => {
    const currentImage: ImageModel = await knex('images').select('url', 'type').where('id', imageId).first();
    if (!currentImage) throw new Error(imageExceptionMessages.IMAGE_NOT_FOUND);

    const updatedImage: ImageModel = {
        ...currentImage, ...newImageData,
        updated_by: username,
    };

    return await knex('images').where('id', imageId).update(updatedImage);
}

export const removeImage = async (imageId: number): Promise<ImageModel> => {
    const image = await findImage(imageId);
    if (!image) throw new Error(imageExceptionMessages.IMAGE_NOT_FOUND)

    return await knex('images').select('*').where('id', imageId).del();
}
