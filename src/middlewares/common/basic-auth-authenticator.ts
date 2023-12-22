import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isEmpty, isNil } from 'lodash';
import config from 'src/config';

export const basicAuthAuthenticatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.authentication.basicAuth.enabled) {
    const authHeader = req.headers?.authorization;
    if (!isNil(authHeader) && !isEmpty(authHeader)) {
      const authHeaderParts = authHeader.split(' ');

      if (
        !isNil(authHeaderParts) &&
        !isEmpty(authHeaderParts) &&
        authHeaderParts.length === 2 &&
        authHeaderParts[0] === 'Basic'
      ) {
        const authHeaderCredentials = authHeaderParts[1];
        const decodedCredentials = Buffer.from(authHeaderCredentials, 'base64').toString('utf-8');

        if (decodedCredentials !== `${config.authentication.basicAuth.username}:${config.authentication.basicAuth.password}`) {
          res
            .status(StatusCodes.UNAUTHORIZED)
            .json({
              reason: 'Authorization header contains invalid credentials',
            });

          return;
        }
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({
            reason: 'Authorization header is malformed',
          });

        return;
      }

    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({
          reason: 'Authorization header is missing',
        });

      return;
    }
  }

  next();
};
