import knex from '../../config/knex.config';
import { ImageModel } from './image.model';

export const fetchById = async (imageId: number) => {
    return await knex('images').where('id', imageId).andWhere('isdeleted', false).first();
}

export const create = async (imageData: ImageModel) => {
    return await knex('images').insert(imageData);
}

export const update = async (imageData: ImageModel, imageId: number) => {
    return await knex('images').where('id', imageId).update(imageData);
}

export const remove = async (imageId: number) => {
    return await knex('images').update('isdeleted', true).where('id', imageId);
}
