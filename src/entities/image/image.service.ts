import knex from '../../config/knex.config';
import { ImageModel } from './image.model';

const dummyData: ImageModel[] = [
    {
        name: 'Image 1',
        url: 'https://example.com/image1.jpg',
        type: 'user',
        created_by: 'John',
        updated_by: 'John',
    },
    {
        name: 'Image 2',
        url: 'https://example.com/image2.jpg',
        type: 'bookmark',
        created_by: 'Jane',
        updated_by: 'Jane',
    },
    {
        name: 'Image 3',
        url: 'https://example.com/image3.jpg',
        type: 'folder',
        created_by: 'Alex',
        updated_by: 'Alex',
    },
];


export const findImage = async (imageId: number) => {
    const image: ImageModel = await knex('images').select().where('id', imageId).first();
    if (!image) throw new Error(`Image with id ${imageId} doesnot exist`)
    await knex('images').insert(dummyData);
    return image;
}


export const saveImage = async (imageData: ImageModel) => {
    const newImage: ImageModel = {
        ...imageData,
        created_by: 'admin',
        updated_by: 'admin',
    }
    return await knex('images').insert(newImage);
}

export const updateImage = async (newImageData: ImageModel, imageId: number) => {
    const currentImage: ImageModel = await knex('images').column('name', 'url', 'type').select().where('id', imageId).first();
    if (!currentImage) throw new Error(`image with id ${imageId} doesnot exist`);

    const updatedImage = { ...currentImage, ...newImageData };

    return await knex('images').where('id', imageId).update(updatedImage);
}

export const removeImage = async (imageId: number) => {
    const image = await findImage(imageId);
    if (!image) throw new Error(`Image with id ${imageId} doesnot exist`)

    const result = await knex('images').select('*').where('id', imageId).del();
    return result;
}
