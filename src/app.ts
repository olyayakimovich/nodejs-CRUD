import express from 'express';
import {
  createUser,
  getUserById,
  getAutoSuggest,
  updateUser,
  deleteUser,
  findUser,
} from './controllers/userController';

const app = express();

app.use(express.json());

app.param('id', findUser);

app.route('/users').get(getAutoSuggest).post(createUser);

app.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default app;
