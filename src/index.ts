const express = require('express');

const NodeCache = require('node-cache');

const Joi = require('joi');

const { v4: uuidv4 } = require('uuid');

const passwordComplexity = require('joi-password-complexity');

const app = express();
const { Request, Response } = express;

const myCache = new NodeCache();

type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

type ValidationError = {
  message: string;
  path: string[];
  type: string;
};

const NO_CONTENT_CODE = 204;
const BAD_REQUEST_CODE = 400;
const NOT_FOUND_CODE = 404;
const INTERNAL_ERROR = 500;
const AUTO_SUGGEST_LIMIT = 3;
const ZERO = 0;
const LOGIN_MIN_LENGTH = 3;
const LOGIN_MAX_LENGTH = 30;
const MIN_AGE = 4;
const MAX_AGE = 130;

const complexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 0,
  numeric: 1,
  symbol: 0,
  requirementCount: 2,
};

const schema = Joi.object({
  login: Joi.string().alphanum().min(LOGIN_MIN_LENGTH).max(LOGIN_MAX_LENGTH).required(),
  password: passwordComplexity(complexityOptions).required(),

  age: Joi.number().integer().min(MIN_AGE).max(MAX_AGE).required(),
});

const compareStrings = (searchLogin: string, login: string) => {
  return searchLogin.split('').every((value: string, index: number) => value === login[index]);
};

const getAutoSuggestUsers = (loginSubstring: string, limit: number) => {
  const userKeys = myCache.keys();

  const users = userKeys.map((key: string) => myCache.get(key));

  const foundItems = users.filter((user: User) => compareStrings(loginSubstring, user.login));

  return foundItems.slice(ZERO, limit);
};

app.use(express.json());

// HANDLERS
const getUserById = (req: typeof Request, res: typeof Response) => {
  const user = myCache.get(req.params.id);

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  return res.json({
    status: 'success',
    user,
  });
};

const getAutoSuggest = (req: typeof Request, res: typeof Response) => {
  const { login } = req.query;

  const users = getAutoSuggestUsers(login, AUTO_SUGGEST_LIMIT);

  return res.json({
    status: 'success',
    searchString: login,
    users,
  });
};

const createUser = (req: typeof Request, res: typeof Response) => {
  const { error } = schema.validate(req.body);

  if (error) {
    const errors = error.details.map((err: ValidationError) => err.message);

    return res.status(BAD_REQUEST_CODE).json({ status: 'fail', message: errors });
  }

  const id = uuidv4();

  const user = { ...req.body, id, isDeleted: false };

  const success = myCache.set(String(id), user);

  if (!success) {
    return res.status(INTERNAL_ERROR).json({ status: 'fail', message: 'User cannot be saved' });
  }

  return res.json({
    status: 'success',
    user,
  });
};

const updateUser = (req: typeof Request, res: typeof Response) => {
  const user = myCache.get(req.params.id);

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  const { error } = schema.validate(req.body);

  if (error) {
    const errors = error.details.map((err: ValidationError) => err.message);

    return res.status(BAD_REQUEST_CODE).json({ status: 'fail', message: errors });
  }

  myCache.del(req.params.id);
  const body = { ...req.body, id: req.params.id, isDeleted: false };
  const success = myCache.set(req.params.id, body);

  if (!success) {
    return res.status(INTERNAL_ERROR).json({ status: 'fail', message: 'User cannot be saved' });
  }

  return res.json({
    status: 'success',
    user: body,
  });
};

const deleteUser = (req: typeof Request, res: typeof Response) => {
  const user = myCache.get(req.params.id);

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  user.isDeleted = true;

  const success = myCache.set(String(req.params.id), user);

  if (!success) {
    return res.status(INTERNAL_ERROR).json({ status: 'fail', message: 'User cannot be deleted' });
  }

  return res.status(NO_CONTENT_CODE).json({
    status: 'success',
    user: null,
  });
};

// ROUTES
app.route('/users').get(getAutoSuggest).post(createUser);

app.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

const PORT = 3000;

app.listen(PORT, () => {
  console.log('App is running');
});
