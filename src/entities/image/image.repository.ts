import knex from '../../config/knex.config';
import { ImageModel } from './image.model';

export const fetchById = async (imageId: number) => {
    return await knex('images').where('id', imageId).andWhere('isdeleted', false).first();
}

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
