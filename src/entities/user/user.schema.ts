import joi, { Schema } from 'joi';

const userSchema: Schema = joi.object().keys({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)).required(),
    image_id: joi.number(),
    role: joi.string().valid('normal', 'admin'),    user: joi.object().keys({
        id: joi.number().required(),
        username: joi.string().required(),
        email: joi.string().required(),
        iat: joi.number(),
    }),
})

export default userSchema;