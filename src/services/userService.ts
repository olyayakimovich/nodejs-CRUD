import { v4 as uuidv4 } from 'uuid';
import { User, CreateUser, GetUser } from '../types';
import { UserModel } from '../models';
import { mapUserToClient, mapSuggestUsers } from '../mappers/userMapper';

class UserService {
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

    const group = await user.getGroups();

    if (group.length) {
      const groupId = group[0].get().id;

      await user.removeGroup(groupId);
    }

    await UserModel.destroy({ where: { id } });
  };

  addUsersToGroup = async (groupId: string, userIds: string[]): Promise<void> => {
    const users = await UserModel.findAll({ where: { id: userIds } });

    if (!users.length) return;

    users.forEach(async (user) => {
      await user.addGroup([groupId]);
    });
  };
}

const userService = new UserService();

export default userService;
