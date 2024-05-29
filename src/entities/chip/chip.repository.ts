import knex from '../../config/knex.config'
import { ChipModel } from './chip.model';

export const fetchById = async (chipId: number) => {
    return await knex('chips').select('id', 'name', 'user_id', 'folder_id').where('id', chipId).andWhere('isdeleted', false).first();
}

export const fetchAll = async (user_id: number) => {
    return await knex('chips').select('id', 'name', 'user_id', 'folder_id').where('user_id', user_id).andWhere('isdeleted', false);
}

export const create = async (chipData: ChipModel) => {
    const chip = await knex('chips').insert(chipData).returning('id');
    return { chipID: chip[0].id };
}

export const update = async (chipData: ChipModel, chipId: number) => {
    return await knex('chips').where('id', chipId).update(chipData);
}

export const remove = async (chipId: number) => {
    return await knex('chips').update('isdeleted', true).where('id', chipId);
}
