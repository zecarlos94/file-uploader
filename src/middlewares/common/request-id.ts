import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.request_id = crypto.randomUUID();

  next();
};
