import { NextFunction, Request, Response } from 'express';

import { userSchema } from './schema';
import { NO_CONTENT_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE, SUCCESS, FAIL } from '../constants';
import userService from '../services/userService';
import HttpException from '../utils/httpExeption';
import catchAsync from '../utils/catchAsync';

export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    return next(new HttpException(NOT_FOUND_CODE, 'User not found', 'getUserById'));
  }

  return res.json({
    status: 'success',
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
  const userExists = await userService.findUserByLogin(req.body.login);

  const args = Object.entries(req.body).map(([key, value]) => `${key}: ${value}`);

  if (userExists) {
    return next(
      new HttpException(BAD_REQUEST_CODE, `User with login ${req.body.login} already exists`, 'createUser', args)
    );
  }

  const { error } = userSchema.validate(req.body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return next(new HttpException(BAD_REQUEST_CODE, `${errors}`, 'createUser', args));
  }

  const user = await userService.createUser(req.body);

  return res.json({
    status: SUCCESS,
    user,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userExists = await userService.findUserById(req.params.id);

  const args = Object.entries(req.body).map(([key, value]) => `${key}: ${value}`);

  if (!userExists) {
    return next(new HttpException(NOT_FOUND_CODE, 'User not found', 'updateUser', args));
  }

  const { error } = userSchema.validate(req.body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return next(new HttpException(BAD_REQUEST_CODE, `${errors}`, 'updateUser', args));
  }

  const user = await userService.updateUser(req.body, req.params.id);

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
