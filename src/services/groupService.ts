import { v4 as uuidv4 } from 'uuid';
import { Group, CreateGroup } from '../types';
import { GroupModel } from '../models';

class GroupService {
  getGroupById = async (id: string): Promise<Group | undefined> => {
    const group = await GroupModel.findOne({ where: { id } });

    return group?.get();
  };

  createGroup = async (body: CreateGroup): Promise<Group> => {
    const id = uuidv4();
    const group = await GroupModel.create({ ...body, id });

    return group.get();
  };

  findAll = async (): Promise<Group[]> => {
    const groups = await GroupModel.findAll();

    console.log(groups, 'groups');

    return groups.map((group) => group.get());
  };

  findGroupByName = async (name: string): Promise<Group | undefined> => {
    const group = await GroupModel.findOne({ where: { name } });

    return group?.get();
  };

  updateGroup = async (body: CreateGroup, id: string): Promise<Group> => {
    const group = await GroupModel.update(body, { where: { id }, returning: true });

    return group[1][0].get();
  };

  deleteGroup = async (id: string): Promise<void> => {
    const group = await GroupModel.findOne({ where: { id } });

    if (!group) return;

    const users = await group.getUsers();

    if (users.length) {
      const userIds = users.map((user) => user.get().id);

      await group.removeUsers(userIds);
    }
    await GroupModel.destroy({ where: { id } });
  };
}

const groupService = new GroupService();

export default groupService;
