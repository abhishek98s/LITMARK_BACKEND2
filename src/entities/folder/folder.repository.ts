import knex from '../../config/knex.config'
import { FolderModel } from './folder.model';

export const fetchAllParent = async (user_id: number) => {
    return knex('folders').select('*').where('user_id', user_id).andWhere('folder_id', null).andWhere('isdeleted', false);
}

export const fetchAllNested = async (user_id: number, parentFolderId: number) => {
    return await knex('folders').select('*').where('user_id', user_id).andWhere('folder_id', parentFolderId).andWhere('isdeleted', false);
}

export const fetchById = async (folderId: number) => {
    return await knex('folders').select('*').where('id', folderId).andWhere('isdeleted', false).first();
}

export const fetchAllByFolderId = async (folderId: number) => {
    return await knex('folders').where('folder_id ', folderId);
}

export const create = async (folderData: FolderModel) => {
    return await knex('folders').insert(folderData).returning('id');
}

export const update = async (folderData: FolderModel, folderId: number) => {
    return await knex('folders').where('id', folderId).update(folderData);
}

export const remove = async (folderId: number) => {
    return await knex('folders').where('id', folderId).update('isdeleted', true);
}

export const sortBy = async (sortBy: string, userId: number, folderId: number, sortOrder: string) => {
    return await knex('folders').orderBy(sortBy, sortOrder).where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folderId);
}