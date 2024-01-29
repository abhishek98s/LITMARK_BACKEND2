import joi from 'joi';

const authSchema = {
    login: joi.object().keys({
        email: joi.string().required(),
        password: joi.string().required(),
    }),

    register: joi.object().keys({
        username: joi.string().required(),
        password: joi.string().min(8).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)).required(),
        email: joi.string().email().required(),
    }),
}

export default authSchema;
