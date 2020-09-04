import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import omit from 'lodash/omit';

import schema from './schema';
import { NO_CONTENT_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE } from '../constants';
import { mapSuggestUsers } from '../mappers/userMapper';
import UserService from '../services/userService';

export const getUserById = async (req: Request, res: Response) => {
  const user = await new UserService().findUserById(req.params.id);

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  return res.json({
    status: 'success',
    user: omit(user, 'password'),
  });
};

export const getAutoSuggest = async (req: Request, res: Response) => {
  const { login, limit } = req.query;

  const users = await new UserService().findAll();

  return res.json({
    status: 'success',
    searchString: login,
    users: mapSuggestUsers(users, login as string, limit as string),
  });
};

export const createUser = async (req: Request, res: Response) => {
  const { login, password, age } = req.body;

  const userExists = await new UserService().findUserByLogin(login);

  if (userExists) {
    return res
      .status(BAD_REQUEST_CODE)
      .json({ status: 'fail', message: `User with login ${req.body.login} already exists` });
  }

  const { error } = schema.validate(req.body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return res.status(BAD_REQUEST_CODE).json({ status: 'fail', message: errors });
  }

  const id = uuidv4();

  try {
    const user = await new UserService().createUser({
      id,
      login,
      password,
      age,
      isDeleted: false,
    });

    return res.json({
      status: 'success',
      user: omit(user, 'password'),
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: 'fail',
      message: err,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await new UserService().findUserById(req.params.id);

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  const { error } = schema.validate(req.body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return res.status(BAD_REQUEST_CODE).json({ status: 'fail', message: errors });
  }

  try {
    await new UserService().updateUser({ ...user, ...req.body }, req.params.id);

    return res.json({
      status: 'success',
      user: omit({ ...user, ...req.body }, 'password'),
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: 'fail',
      message: err,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await new UserService().findUserById(req.params.id);

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  try {
    await new UserService().updateUser({ ...user, isDeleted: true }, req.params.id);

    return res.status(NO_CONTENT_CODE).json({
      status: 'success',
      user: null,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: 'fail',
      message: err,
    });
  }
};
