import { Request, Response, NextFunction } from 'express';

import { v4 as uuidv4 } from 'uuid';
import schema from './schema';
import { NO_CONTENT_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE, AUTO_SUGGEST_LIMIT } from '../constants';
import { User, ExtendedRequest } from '../types';
import { getAutoSuggestUsers } from '../utils';
// import PasswordComplexity from 'joi-password-complexity';

// const complexityOptions = {
//   min: 8,
//   max: 26,
//   lowerCase: 1,
//   upperCase: 0,
//   numeric: 1,
//   symbol: 0,
//   requirementCount: 2,
// };

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
    user,
  });
};

export const getAutoSuggest = (req: Request, res: Response) => {
  const { login } = req.query;

  return res.json({
    status: 'success',
    searchString: login,
    users: getAutoSuggestUsers(users, login as string, AUTO_SUGGEST_LIMIT),
  });
};

export const createUser = (req: Request, res: Response) => {
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
    user,
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

  const body = { ...user, ...req.body };

  users = users.map((value: User) => {
    if (value.id !== req.params.id) return value;

    return body;
  });

  return res.json({
    status: 'success',
    user: body,
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
