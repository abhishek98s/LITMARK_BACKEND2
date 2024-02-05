import bcrypt from 'bcrypt'

import knex from '../../config/knex.config'
import { UserModel } from './user.model'


/**
 * The function `getUserById` retrieves a user from a database based on their ID and returns it.
 * @param {number} userId - The `userId` parameter is a number that represents the unique identifier of
 * a user.
 * @returns a Promise that resolves to a UserModel object.
 */
export const getUserById = async (userId: number) => {
    const user: UserModel = await knex('users').select('*').where('id', userId).first();
    if (!user) throw new Error('Failed to get user')

    return user;
}

/**
 * The function `addUser` takes in user information, hashes the password, inserts the user into a
 * database, and returns the user.
 * @param {UserModel} userInfo - The `userInfo` parameter is an object of type `UserModel` which
 * contains information about the user that needs to be added. This information typically includes
 * properties such as `username`, `email`, and `password`.
 * @returns the user object that was inserted into the "users" table in the database.
 */
export const addUser = async (userInfo: UserModel) => {
    const { password } = userInfo;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await knex('users').insert({ ...userInfo, password: hashedPassword });
    if (!user) throw new Error('Failed to add user')

    const [userID] = user;

    return await getUserById(userID);
}

/**
 * The function updates a user's information in the database and returns the updated user.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user that needs to
 * be updated. It is of type `number`.
 * @param {UserModel} updatedUserInfo - The `updatedUserInfo` parameter is an object of type
 * `UserModel` that contains the updated information for the user.
 * @returns the updated user information.
 */
export const updateUser = async (userId: number, updatedUserInfo: UserModel) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(updatedUserInfo.password, salt);

    const user: UserModel = await knex('users').select('*').where('id', userId).update({ ...updatedUserInfo, password: hashedPassword });
    if (!user) throw new Error('Failed to upadate user')

    return await getUserById(userId);
}

/**
 * The function removes a user from the database by their ID and returns the deleted user.
 * @param {number} userId - The `userId` parameter is the unique identifier of the user that needs to
 * be removed from the database.
 * @returns the deleted user object.
 */
export const removeUser = async (userId: number) => {
    const currentUser = await getUserById(userId);
    if (!currentUser) throw new Error('User doesnot exist')

    const user: UserModel = await knex('users').select('*').where('id', userId).del();
    if (!user) throw new Error('Failed to delete user')

    return currentUser;
}
