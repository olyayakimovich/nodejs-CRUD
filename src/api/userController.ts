import { NextFunction, Request, Response } from 'express';

import { userSchema } from './schema';
import { NO_CONTENT_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE, SUCCESS } from '../constants';
import userService from '../services/userService';
import { HttpException, catchAsync } from '../utils';

export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { params, url, method } = req;
  const user = await userService.getUserById(params.id);

  if (!user) {
    return next(new HttpException(NOT_FOUND_CODE, 'User not found', `getUserById: ${method} request to ${url}`));
  }

  return res.json({
    status: SUCCESS,
    user,
  });
});

export const getAutoSuggest = catchAsync(async (req: Request, res: Response) => {
  const { login, limit } = req.query;

  const users = await userService.suggestUsers(login as string, limit as string);

  return res.json({
    status: SUCCESS,
    searchString: login,
    users,
  });
});

export const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { body, url, method } = req;
  const userExists = await userService.findUserByLogin(body.login);

  if (userExists) {
    return next(
      new HttpException(
        BAD_REQUEST_CODE,
        `User with login ${body.login} already exists`,
        `createUser: ${method} request to ${url}`,
        req.body
      )
    );
  }

  const { error } = userSchema.validate(body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return next(new HttpException(BAD_REQUEST_CODE, `${errors}`, `createUser: ${method} request to ${url}`, body));
  }

  const user = await userService.createUser(body);

  return res.json({
    status: SUCCESS,
    user,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { params, url, body, method } = req;
  const userExists = await userService.findUserById(params.id);

  if (!userExists) {
    return next(new HttpException(NOT_FOUND_CODE, 'User not found', `updateUser: ${method} request to ${url}`, body));
  }

  const { error } = userSchema.validate(body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return next(new HttpException(BAD_REQUEST_CODE, `${errors}`, `updateUser: ${method} request to ${url}`, body));
  }

  const user = await userService.updateUser(body, params.id);

  return res.json({
    status: SUCCESS,
    user,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);

  return res.status(NO_CONTENT_CODE).json({
    status: SUCCESS,
    user: null,
  });
});

export const addUsersToGroup = catchAsync(async (req: Request, res: Response) => {
  const { groupId, userIds } = req.body;

  await userService.addUsersToGroup(groupId, userIds);

  return res.json({
    status: SUCCESS,
    message: 'Users where added to group successfully',
  });
});
