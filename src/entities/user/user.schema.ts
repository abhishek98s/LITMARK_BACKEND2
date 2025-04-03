import joi, { Schema } from 'joi';
import { authExceptionMessages } from '../../auth/constant/authExceptionMessages';

const userSchema: Schema = joi.object().keys({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .min(8)
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/))
    .required(),
  image_id: joi.number(),
  role: joi.string().valid('normal', 'admin'),
  user: joi.object().keys({
    id: joi.number().required(),
    username: joi.string().required(),
    email: joi.string().required(),
    iat: joi.number(),
  }),
});

const patchUserSchema: Schema = joi.object().keys({
  username: joi.string().required().messages({
    'string.base': authExceptionMessages.USERNAME_STRING,
    'any.required': authExceptionMessages.USERNAME_REQUIRED,
    'string.empty': authExceptionMessages.USERNAME_EMPTY,
  }),
  password: joi
    .string()
    .min(8)
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/))
    .required()
    .messages({
      'string.base': authExceptionMessages.PASSWORD_STRING,
      'string.min': authExceptionMessages.PASSWORD_SHORT,
      'string.empty': authExceptionMessages.PASSWORD_EMPTY,
      'string.pattern.base': authExceptionMessages.PASSWORD_INVALID,
      'any.required': authExceptionMessages.PASSWORD_REQUIRED,
    }),
  user: joi.object().keys({
    id: joi.number().required(),
    username: joi.string().required(),
    email: joi.string().required(),
    iat: joi.number(),
  }),
});

export default userSchema;
export { patchUserSchema };
