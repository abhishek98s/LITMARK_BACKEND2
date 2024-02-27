import joi, { Schema } from 'joi';

const bookmarkSchema: Schema = joi.object().keys({
    title: joi.string().required(),
    folder_id: joi.number().required(),
    chip_id: joi.number(),
    litmark_image: joi.binary(),
    user: joi.object().keys({
        id: joi.number().required(),
        username: joi.string().required(),
        iat: joi.number(),
    }),
})

export default bookmarkSchema;
