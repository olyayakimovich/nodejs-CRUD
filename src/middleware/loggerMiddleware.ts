import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, body } = req;

  logger.log({
    level: 'info',
    message: `Sending ${method} request to ${url}`,
    body,
  });
  next();
};

export default loggerMiddleware;
