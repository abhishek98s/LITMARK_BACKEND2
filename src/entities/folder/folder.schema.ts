import joi, { Schema } from 'joi';

const folderSchema: Schema = joi.object().keys({
    name: joi.string().required(),
    folder_id: joi.number().allow(null).required(),
    user: joi.object().keys({
        id: joi.number().required(),
        username: joi.string().required(),
        email: joi.string().required(),
        iat: joi.number(),
    }),
})

export default folderSchema;
