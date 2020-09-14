import { Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { User, CreateUser, GetUser } from '../types';
import { UserModel } from '../models';
import { mapUserToClient, mapSuggestUsers } from '../mappers/userMapper';
import sequelize from '../database/connection';

class UserService {
  transaction: Transaction;

  findAll = async (): Promise<User[]> => {
    const users = await UserModel.findAll();

    if (!users) return [];

    return users.map((user) => user.get());
  };

  findUserById = async (id: string): Promise<User | null> => {
    const user = await UserModel.findOne({ where: { id } });

    if (!user) return null;

    return user.get();
  };

  getUserById = async (id: string): Promise<GetUser | null> => {
    const user = await this.findUserById(id);

    if (!user) return null;

    return mapUserToClient(user);
  };

  suggestUsers = async (login: string, limit: string): Promise<GetUser[]> => {
    const users = await this.findAll();

    return mapSuggestUsers(users, login, limit);
  };

  findUserByLogin = async (login: string): Promise<User | null> => {
    const user = await UserModel.findOne({
      where: { login },
    });

    if (!user) return null;

    return user.get();
  };

  createUser = async (body: CreateUser): Promise<GetUser> => {
    const id = uuidv4();
    const user = await UserModel.create({ ...body, id });

    return mapUserToClient(user.get());
  };

  updateUser = async (body: CreateUser, id: string): Promise<GetUser> => {
    const user = await UserModel.update(body, { where: { id }, returning: true });

    return mapUserToClient(user[1][0].get());
  };

  deleteUser = async (id: string): Promise<void> => {
    const user = await UserModel.findOne({ where: { id } });

    if (!user) return;

    const groups = await user.getGroups();

    if (groups.length) {
      const groupIds = groups.map((group) => group.get().id);

      await user.removeGroups(groupIds);
    }

    await UserModel.destroy({ where: { id } });
  };

  addUsersToGroup = async (groupId: string, userIds: string[]): Promise<void> => {
    try {
      this.transaction = await sequelize.transaction();

      const users = await UserModel.findAll({ where: { id: userIds }, transaction: this.transaction });

      if (!users.length) return;

      const promises = [];

      for (let i = 0; i < users.length; i += 1) {
        promises.push(users[i].addGroup([groupId], { transaction: this.transaction }));
      }

      await Promise.all(promises);

      await this.transaction.commit();
    } catch (err) {
      if (this.transaction) await this.transaction.rollback();
    }
  };
}

const userService = new UserService();

export default userService;
