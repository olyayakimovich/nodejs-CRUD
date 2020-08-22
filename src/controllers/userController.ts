import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import omit from 'lodash/omit';

import schema from './schema';
import { NO_CONTENT_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE } from '../constants';
import { User, ExtendedRequest } from '../types';
import { getAutoSuggestUsers } from '../utils';

let users: User[] = [];

export const findUser = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  req.user = users.find((value: User) => value.id === req.params.id);
  next();
};

export const getUserById = (req: ExtendedRequest, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  return res.json({
    status: 'success',
    user: omit(user, 'password'),
  });
};

export const getAutoSuggest = (req: Request, res: Response) => {
  const { login, limit } = req.query;

  return res.json({
    status: 'success',
    searchString: login,
    users: getAutoSuggestUsers(users, login as string, limit as string),
  });
};

export const createUser = (req: Request, res: Response) => {
  const userExists = users.some((value: User) => value.login === req.body.login);

  if (userExists)
    return res
      .status(BAD_REQUEST_CODE)
      .json({ status: 'fail', message: `User with login ${req.body.login} already exists` });

  const { error } = schema.validate(req.body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return res.status(BAD_REQUEST_CODE).json({ status: 'fail', message: errors });
  }

  const id = uuidv4();

  const user = { ...req.body, id, isDeleted: false };

  users.push(user);

  return res.json({
    status: 'success',
    user: omit(user, 'password'),
  });
};

export const updateUser = (req: ExtendedRequest, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  const { error } = schema.validate(req.body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return res.status(BAD_REQUEST_CODE).json({ status: 'fail', message: errors });
  }

  const updatedUser = { ...user, ...req.body };

  users = users.map((value: User) => {
    if (value.id !== req.params.id) return value;

    return updatedUser;
  });

  return res.json({
    status: 'success',
    user: omit(updatedUser, 'password'),
  });
};

export const deleteUser = (req: ExtendedRequest, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  users = users.map((value: User) => {
    if (value.id !== req.params.id) return value;

    return { ...value, isDeleted: true };
  });

  return res.status(NO_CONTENT_CODE).json({
    status: 'success',
    user: null,
  });
};
