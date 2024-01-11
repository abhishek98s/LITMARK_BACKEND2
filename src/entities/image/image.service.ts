import knex from '../../config/knex.config';
import { ImageModel } from './image.model';

// const dummyData: ImageModel[] = [
//     {
//         name: 'Image 1',
//         url: 'https://example.com/image1.jpg',
//         type: 'user',
//         created_by: 'John',
//         updated_by: 'John',
//     },
//     {
//         name: 'Image 2',
//         url: 'https://example.com/image2.jpg',
//         type: 'bookmark',
//         created_by: 'Jane',
//         updated_by: 'Jane',
//     },
//     {
//         name: 'Image 3',
//         url: 'https://example.com/image3.jpg',
//         type: 'folder',
//         created_by: 'Alex',
//         updated_by: 'Alex',
//     },
// ];

interface JWTModel {
    id: number,
    role: string,
    username: string
}

export const findImage = async (imageId: number): Promise<ImageModel> => {
    const image: ImageModel = await knex('images').select().where('id', imageId).first();
    if (!image) throw new Error(`Image with id ${imageId} doesnot exist`)

    return image;
}


export const saveImage = async (imageData: ImageModel, userId?: number) => {
    const decodedJWTUserRole: JWTModel = await knex('users').select('role').where('id', userId).first();
    const userRole = await decodedJWTUserRole.role;

    const newImage: ImageModel = {
        ...imageData,
        created_by: userRole,
        updated_by: userRole,
    }
    return await knex('images').insert(newImage);
}

export const updateImage = async (newImageData: ImageModel, imageId: number, userId?: number): Promise<ImageModel> => {
    const decodedJWTUsername: JWTModel = await knex('users').select('username').where('id', userId).first();
    const username = await decodedJWTUsername.username;
    
    const currentImage: ImageModel = await knex('images').select('url', 'type').where('id', imageId).first();
    if (!currentImage) throw new Error(`Image with id ${imageId} doesnot exist`);

    const updatedImage: ImageModel = { ...currentImage, ...newImageData,
        updated_by: username,
    };

    return await knex('images').where('id', imageId).update(updatedImage);
}

export const removeImage = async (imageId: number): Promise<ImageModel> => {
    const image = await findImage(imageId);
    if (!image) throw new Error(`Image with id ${imageId} doesnot exist`)

    return await knex('images').select('*').where('id', imageId).del();
}
