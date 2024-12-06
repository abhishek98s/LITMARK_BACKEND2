import { StatusCodes } from 'http-status-codes';
import knex from '../../config/knex.config';
import { UserModel } from '../../entities/user/user.model';
import { addUser } from '../../entities/user/user.service';
import { customHttpError } from '../../utils/customHttpError';

export const findUserByEmail = async (email: string) => {
  const user = await knex('users')
    .select('username', 'id', 'password', 'email')
    .where('email', email)
    .first();
  if (!user)
    throw new customHttpError(StatusCodes.NOT_FOUND, 'User doesn\'t exist');

  return user;
};

export const register = async (userData: UserModel) => {
  return await addUser(userData);
};
