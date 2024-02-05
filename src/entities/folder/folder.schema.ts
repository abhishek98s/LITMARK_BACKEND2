import joi, { Schema } from 'joi';

const folderSchema: Schema = joi.object().keys({
    name: joi.string().required(),
    image_id: joi.number().required(),
    user_id: joi.number().required(),
    folder_id: joi.number().required(),
    user: joi.object().keys({
        id: joi.number().required(),
        username: joi.string().required(),
        iat: joi.number(),
    }),
})

export default folderSchema;