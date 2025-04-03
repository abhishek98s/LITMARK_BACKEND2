import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authExceptionMessages } from '../auth/constant/authExceptionMessages';

const notFoundHandler = (req: Request, res: Response) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, message: authExceptionMessages.ROUTE_NOT_EXISTS });
};

export default notFoundHandler;
