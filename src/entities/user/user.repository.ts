import knex from '../../config/knex.config';
import { UserModel } from './user.model';

export const fetchById = async (userId: number) => {
    return await knex('users').select('id', 'username', 'email', 'image_id').where('id', userId).andWhere('isdeleted', false).first();
}

export const create = async (userData: UserModel) => {
    const user = await knex('users').insert(userData).returning('id');
    return { userID: user[0].id };
}

export const update = async (userData: UserModel, userId: number) => {
    return await knex('users').select('*').where('id', userId).update(userData);
}

export const remove = async (userId: number) => {
    return await knex('users').where('id', userId).update('isdeleted', true);
}
