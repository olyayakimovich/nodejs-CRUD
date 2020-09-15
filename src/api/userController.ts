import { Request, Response } from 'express';

import { userSchema } from './schema';
import { NO_CONTENT_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE, SUCCESS, FAIL } from '../constants';
import userService from '../services/userService';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(NOT_FOUND_CODE).json({ status: FAIL, message: 'User not found' });
    }

    return res.json({
      status: SUCCESS,
      user,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};

export const getAutoSuggest = async (req: Request, res: Response) => {
  try {
    const { login, limit } = req.query;

    const users = await userService.suggestUsers(login as string, limit as string);

    return res.json({
      status: SUCCESS,
      searchString: login,
      users,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userExists = await userService.findUserByLogin(req.body.login);

    if (userExists) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ status: FAIL, message: `User with login ${req.body.login} already exists` });
    }

    const { error } = userSchema.validate(req.body);

    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(BAD_REQUEST_CODE).json({ status: FAIL, message: errors });
    }

    const user = await userService.createUser(req.body);

    return res.json({
      status: SUCCESS,
      user,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userExists = await userService.findUserById(req.params.id);

    if (!userExists) {
      return res.status(NOT_FOUND_CODE).json({ status: FAIL, message: 'User not found' });
    }

    const { error } = userSchema.validate(req.body);

    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(BAD_REQUEST_CODE).json({ status: FAIL, message: errors });
    }

    const user = await userService.updateUser(req.body, req.params.id);

    return res.json({
      status: SUCCESS,
      user,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id);

    return res.status(NO_CONTENT_CODE).json({
      status: SUCCESS,
      user: null,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};

export const addUsersToGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, userIds } = req.body;

    await userService.addUsersToGroup(groupId, userIds);

    return res.json({
      status: SUCCESS,
      message: 'Users where added to group successfully',
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};
