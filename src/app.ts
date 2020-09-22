import express, { Request, Response, NextFunction } from 'express';

import { createUser, getUserById, getAutoSuggest, updateUser, deleteUser } from './api/userController';
import errorMiddleware from './middleware/errorMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';
import HttpException from './utils/httpExeption';
import { NOT_FOUND_CODE } from './constants';

// db connection
import './database/connection';

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.route('/users').get(getAutoSuggest).post(createUser);

app.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new HttpException(NOT_FOUND_CODE, `Can't find ${req.url}`));
});

app.use(errorMiddleware);

export default app;
