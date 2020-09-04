import express from 'express';
import { createUser, getUserById, getAutoSuggest, updateUser, deleteUser } from './api/userController';

// db connection
import './database/connection';

const app = express();

app.use(express.json());

app.route('/users').get(getAutoSuggest).post(createUser);

app.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default app;
