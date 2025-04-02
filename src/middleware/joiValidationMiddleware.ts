import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Schema } from 'joi';

const joiValidationMiddleware = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = await schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message });
    }
  };
};

export default joiValidationMiddleware;
