import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

const joiValidationMiddleware = (schema: Schema ) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        
        const { error } = await schema.validate(req.body);
        console.log(schema.validate(req.body));
        const valid = error == null;
        
        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            res.status(422).json({ error: message })
        }
    }
}

export default joiValidationMiddleware