import { User, CreateUser } from '../types';
import UserModel from '../models/User';

export default class UserService {
  findAll = async (): Promise<User[]> => {
    const users = await UserModel.findAll();

    if (!users) return [];

    return users.map((user) => user.get());
  };

  findUserById = async (id: string): Promise<User> => {
    const user = await UserModel.findOne({ where: { id } });

    if (!user) return null;

    return user.get();
  };

  findUserByLogin = async (login: string): Promise<User> => {
    const user = await UserModel.findOne({ where: { login } });

    if (!user) return null;

    return user.get();
  };

  createUser = async (body: CreateUser): Promise<User> => {
    const user = await UserModel.create(body);

    return user.get();
  };

  updateUser = async (body: CreateUser, id: string): Promise<void> => {
    await UserModel.update(body, { where: { id } });
  };
}
