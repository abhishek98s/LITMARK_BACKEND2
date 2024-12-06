import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { customHttpError } from '../utils/customHttpError';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers['authorization'];
    if (!token)
      throw new customHttpError(StatusCodes.FORBIDDEN, 'Access Denied');

    jwt.verify(
      token.replace('Bearer ', ''),
      process.env.JWT_TOKEN as string,
      (err, decoded) => {
        if (err) {
          throw new customHttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
        }

        req.body.user = decoded;
        next();
      },
    );
  } catch (error) {
    res.status(401).json({ msg: (error as Error).message });
  }
};
