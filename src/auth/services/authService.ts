import knex from '../../config/knex.config'
import { UserModel } from '../../entities/user/user.model';
import { addUser } from '../../entities/user/user.service';

export const findUserByEmail = async (email: string) => {
    const user = await knex('users').select('username', 'id', 'password', 'email').where('email', email).first();
    if (!user) throw new Error('User doesn\'t exist')

    return user;
}

export const register = async (userData: UserModel) => {
    return await addUser(userData)
}
