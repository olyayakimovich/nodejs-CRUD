import express, { Request, Response, NextFunction } from 'express';

import errorMiddleware from './middleware/errorMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';
import HttpException from './utils/httpExeption';
import { NOT_FOUND_CODE } from './constants';

import { createUser, getUserById, getAutoSuggest, updateUser, deleteUser, addUsersToGroup } from './api/userController';
import { getAllGroups, createGroup, getGroupById, updateGroup, deleteGroup } from './api/groupController';

// db connection
import './database/connection';

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

// users routes
app.route('/users').get(getAutoSuggest).post(createUser);
app.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);
app.route('/users/addGroup').post(addUsersToGroup);

// groups routes
app.route('/groups').get(getAllGroups).post(createGroup);
app.route('/groups/:id').get(getGroupById).put(updateGroup).delete(deleteGroup);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new HttpException(NOT_FOUND_CODE, `Can't find ${req.url}`));
});

app.use(errorMiddleware);

export default app;
