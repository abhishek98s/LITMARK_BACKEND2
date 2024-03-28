import knex from '../../config/knex.config'
import { ChipModel } from './chip.model';

export const fetchById = async (chipId: number) => {
    return await knex('chips').where('id', chipId).andWhere('isdeleted', false).first();
}

export const fetchAll = async (user_id: number) => {
    return await knex('chips').where('user_id', user_id).andWhere('isdeleted', false);
}

export const create = async (chipData: ChipModel) => {
    return await knex('chips').insert(chipData);
}

export const update = async (chipData: ChipModel, chipId: number) => {
    return await knex('chips').where('id', chipId).update(chipData);
}

export const remove = async (chipData: ChipModel, chipId: number) => {
    return await knex('chips').update(chipData).where('id', chipId);
}
