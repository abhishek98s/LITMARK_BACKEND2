import knex from '../../config/knex.config';
import { ImageModel } from './image.model';

/**
 * The function fetches an image record from a database table based on the provided image ID while
 * ensuring it is not marked as deleted.
 * @param {number} imageId - The `imageId` parameter is a number that represents the unique identifier
 * of an image in the database. The `fetchById` function is an asynchronous function that retrieves
 * image data from the database based on the provided `imageId`. It uses the `knex` library to
 * interact with the database and
 * @returns The `fetchById` function is returning a Promise that resolves to an object containing the
 * properties 'id', 'name', 'url', and 'type' of the image with the specified `imageId` from the
 * 'images' table where 'isdeleted' is false.
 */
export const fetchById = async (imageId: number) => {
    return await knex('images').select('id', 'name', 'url', 'type').where('id', imageId).andWhere('isdeleted', false).first();
}

/**
 * The function creates a new image record in the database and returns the ID of the newly created
 * image.
 * @param {ImageModel} imageData - The `imageData` parameter is an object of type `ImageModel` that
 * contains the data needed to create a new image entry in the database. This data likely includes
 * information such as the image file, title, description, and any other relevant details for the
 * image.
 * @returns { image_id: id }
 */
export const create = async (imageData: ImageModel) => {
    const image = await knex('images').insert(imageData).returning('id');
    const id = image[0].id;
    console.log(id);
    return { image_id: id };
}

export const update = async (imageData: ImageModel, imageId: number) => {
    return await knex('images').where('id', imageId).update(imageData);
}

export const remove = async (imageId: number) => {
    return await knex('images').update('isdeleted', true).where('id', imageId);
}
