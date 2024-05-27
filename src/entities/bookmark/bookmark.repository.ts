import knex from '../../config/knex.config'
import { BookmarkModel } from './bookmark.model';


export const fetchById = async (bookmarkId: number) => {
    return await knex('bookmarks').select('*').where('id', bookmarkId).andWhere('isdeleted', false).first();
}

export const fetchAll = async (user_id: number) => {
    return await knex('bookmarks').select('*').where('user_id', user_id).andWhere('isdeleted', false);
}

export const fetchByFolderId = async (user_id: number, folder_id: number) => {
    return await knex('bookmarks').select('*').where('user_id', user_id).andWhere('folder_id', folder_id).andWhere('isdeleted', false);
}

export const create = async (bookmarkData: BookmarkModel) => {
    return await knex('bookmarks').insert(bookmarkData);
}

export const updateTitle = async (bookmarkData: BookmarkModel, bookmarkId: number) => {
    return await knex('bookmarks').where('id', bookmarkId).update(bookmarkData);
}

export const remove = async (bookmarkData: BookmarkModel) => {
    return await knex('bookmarks').where('id', bookmarkData.id).update(bookmarkData);
}

export const removeByFolderid = async (folderId: number) => {
    return await knex('bookmarks').where('folder_id', folderId).update('isdeleted', true);
}

export const fetchByTitle = async (title: string, folderId: number) => {
    return await knex('bookmarks').select('title', 'url').whereRaw('LOWER(title) LIKE LOWER(?)', [`%${title}%`]).andWhere('isdeleted', false).andWhere('folder_id', folderId)
}

export const sortBy = async (sortBy: string, userId: number, folder_id: number, sortOrder: string) => {
    return await knex('bookmarks').where('user_id', userId).andWhere('isdeleted', false).andWhere('folder_id', folder_id).orderBy(sortBy, sortOrder);
}




export const updateClickedDate = async (bookmarkData: BookmarkModel) => {
    return await knex('bookmarks').update(bookmarkData).where('id', bookmarkData.id)
}

export const removeRecentlyClickedBookmark = async (bookmarkData: BookmarkModel, user_id: number) => {
    return await knex('bookmarks').update(bookmarkData).where('user_id', user_id).andWhere('id', bookmarkData.id);
}

export const sortRecentlyClickedBookmarkBy = async (sortBy: string, userId: number, sortOrder: string) => {
    return await knex('bookmarks').where('user_id', userId).andWhere('isdeleted', false).andWhereNot('click_date', null).orderBy(sortBy, sortOrder);
}

export const filterRecentlyClickedBookmarksByChip = async (userId: number, chipId: number) => {
    return await knex('bookmarks').where('user_id', userId).where('chip_id', chipId).andWhere('isdeleted', false).andWhereNot('click_date', null);
}

export const fetchRecentlyClickedBookmarksByTittle = async (title: string) => {
    return await knex('bookmarks').select('title', 'url').whereRaw('LOWER(title) LIKE LOWER(?)', [`%${title}%`]).andWhere('isdeleted', false).andWhereNot('click_date', null);
}
