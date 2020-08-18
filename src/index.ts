const express = require('express');

const NodeCache = require('node-cache');

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

const NO_CONTENT_CODE = 204;
const NOT_FOUND_CODE = 404;
const INTERNAL_ERROR = 500;
const AUTO_SUGGEST_LIMIT = 3;
const ZERO = 0;

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
  const success = myCache.set(String(req.body.id), req.body);

  if (!success) {
    return res.status(INTERNAL_ERROR).json({ status: 'fail', message: 'User cannot be saved' });
  }

  return res.json({
    status: 'success',
    user: req.body,
  });
};

const updateUser = (req: typeof Request, res: typeof Response) => {
  const user = myCache.get(req.params.id);

  if (!user) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'User not found' });
  }

  myCache.del(req.params.id);
  const success = myCache.set(String(req.body.id), req.body);

  if (!success) {
    return res.status(INTERNAL_ERROR).json({ status: 'fail', message: 'User cannot be saved' });
  }

  return res.json({
    status: 'success',
    user: req.body,
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
