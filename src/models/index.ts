import UserModel from './User';
import GroupModel from './Group';
import UserGroup from './UserGroup';

UserModel.belongsToMany(GroupModel, { through: UserGroup });
GroupModel.belongsToMany(UserModel, { through: UserGroup });

export { UserModel, GroupModel };
