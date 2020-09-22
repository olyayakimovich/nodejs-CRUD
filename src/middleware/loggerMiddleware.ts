import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, body, query } = req;

  logger.log({
    level: 'info',
    message: `Sending request to ${url}`,
    method,
    body,
    query,
  });
  next();
};

export default loggerMiddleware;
