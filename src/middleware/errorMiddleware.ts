import { NextFunction, Request, Response } from 'express';
import { HttpException, logger } from '../utils';
import { SERVER_ERROR } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  const { status, message, methodName, body } = error;

  logger.log({
    level: 'error',
    message,
    status,
    methodName,
    body,
  });

  const errorStatus = status || SERVER_ERROR;
  const errorMessage = message || 'Something went wrong';

  response.status(errorStatus).json({ status: errorStatus, message: errorMessage });
};

export default errorMiddleware;
