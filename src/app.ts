import express, { Request, Response, NextFunction } from 'express';

import { errorMiddleware, loggerMiddleware } from './middleware';
import { HttpException, logger } from './utils';
import { NOT_FOUND_CODE } from './constants';

import {
  createUser,
  getUserById,
  getAutoSuggest,
  updateUser,
  deleteUser,
  addUsersToGroup,
  loginUser,
} from './api/userController';
import { getAllGroups, createGroup, getGroupById, updateGroup, deleteGroup } from './api/groupController';

import './database/connection';

process.on('uncaughtException', (err) => {
  logger.log({ level: 'error', message: err.name });
  process.exit(1);
});

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

// users routes
app.route('/login').post(loginUser);
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

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.log({ level: 'error', message: `Unhandled Rejection at: ${promise}, reason: ${reason}` });
  server.close(() => {
    process.exit(1);
  });
});
