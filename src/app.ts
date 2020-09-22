import express from 'express';
import { createUser, getUserById, getAutoSuggest, updateUser, deleteUser, addUsersToGroup } from './api/userController';
import { getAllGroups, createGroup, getGroupById, updateGroup, deleteGroup } from './api/groupController';

// db connection
import './database/connection';

const app = express();

app.use(express.json());

// users routes
app.route('/users').get(getAutoSuggest).post(createUser);
app.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);
app.route('/users/addGroup').post(addUsersToGroup);

// groups routes
app.route('/groups').get(getAllGroups).post(createGroup);
app.route('/groups/:id').get(getGroupById).put(updateGroup).delete(deleteGroup);

export default app;
