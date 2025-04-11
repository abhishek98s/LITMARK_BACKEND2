import joi, { Schema } from 'joi';
import { bookmarkExceptionMessages } from './constant/bookmarkExceptionMessages';

const bookmarkSchema: Schema = joi.object().keys({
  url: joi.string().required(),
  folder_id: joi.number().required(),
  chip_id: joi.number(),
  user: joi.object().keys({
    id: joi.number().required(),
    username: joi.string().required(),
    email: joi.string().required(),
    iat: joi.number(),
  }),
});

const recentBookmarkSortQuerySchema: Schema = joi
  .object()
  .keys({
    sortBy: joi.string().valid('date', 'alphabet').required().messages({
      'string.base': bookmarkExceptionMessages.SORT_STRING,
      'any.required': bookmarkExceptionMessages.SORT_REQUIRED,
      'string.empty': bookmarkExceptionMessages.SORT_REQUIRED,
      'any.only': bookmarkExceptionMessages.SORT_INVALID,
    }),
    order: joi.string().valid('asc', 'desc').required().messages({
      'string.base': bookmarkExceptionMessages.ORDER_STRING,
      'any.required': bookmarkExceptionMessages.ORDER_REQUIRED,
      'string.empty': bookmarkExceptionMessages.SORT_REQUIRED,
      'any.only': bookmarkExceptionMessages.ORDER_INVALID,
    }),
    user: joi.object().keys({
      id: joi.number().required(),
      username: joi.string().required(),
      email: joi.string().required(),
      iat: joi.number(),
    }),
  })
  .messages({
    'object.unknown': bookmarkExceptionMessages.EXTRA_PROPERTY,
  });

const recentBookmarkFilterQuerySchema: Schema = joi
  .object()
  .keys({
    chip_id: joi.number().required().messages({
      'number.base': bookmarkExceptionMessages.CHIP_ID_NUMBER,
      'any.required': bookmarkExceptionMessages.CHIP_ID_REQUIRED,
      'number.empty': bookmarkExceptionMessages.CHIP_ID_REQUIRED,
    }),
    user: joi.object().keys({
      id: joi.number().required(),
      username: joi.string().required(),
      email: joi.string().required(),
      iat: joi.number(),
    }),
  })
  .messages({
    'object.unknown': bookmarkExceptionMessages.EXTRA_PROPERTY,
  });

const searchRecentBookmarkQuerySchema: Schema = joi
  .object()
  .keys({
    title: joi.string().required().messages({
      'string.base': bookmarkExceptionMessages.TITLE_STRING,
      'any.required': bookmarkExceptionMessages.SEARCH_QUERY_EMPTY,
      'string.empty': bookmarkExceptionMessages.SEARCH_QUERY_EMPTY,
    }),
    user: joi.object().keys({
      id: joi.number().required(),
      username: joi.string().required(),
      email: joi.string().required(),
      iat: joi.number(),
    }),
  })
  .messages({
    'object.unknown': bookmarkExceptionMessages.EXTRA_PROPERTY,
  });

export default bookmarkSchema;
export {
  recentBookmarkSortQuerySchema,
  recentBookmarkFilterQuerySchema,
  searchRecentBookmarkQuerySchema,
};
