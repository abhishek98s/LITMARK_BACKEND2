import joi from 'joi';

const authSchema = {
  login: joi.object()
  .keys({
    email: joi.string().email().required().messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),
    password: joi.string().required().messages({
      'string.base': 'Password must be a string.',
      'any.required': 'Password is required.',
    }),
  })
  .strict().messages({
  'object.unknown': 'Extra properties are not allowed.', // Custom error message for extra properties
}),

  register: joi.object().keys({
    username: joi.string().required().messages({
      'string.base': 'Username must be string',
      'string.required': 'Username is required',
    }),
    password: joi
      .string()
      .min(8)
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/))
      .required()
      .messages({
        'string.base': 'Password must be a string.',
        'string.min': 'Password must be at least {#limit} characters long.',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, and one digit.',
        'any.required': 'Password is required.',
      }),
    email: joi.string().email().required().messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),
  }),
};

export default authSchema;
