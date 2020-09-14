import {
  Model,
  DataTypes,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from 'sequelize';
import sequelize from '../database/connection';
// eslint-disable-next-line import/no-cycle
import UserModel from './User';

type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

interface GroupAttributes {
  id: string;
  name: string;
  permissions: Array<Permission>;
}

class GroupModel extends Model<GroupAttributes> {
  public getUsers!: BelongsToManyGetAssociationsMixin<UserModel>;

  public addUser!: BelongsToManyAddAssociationsMixin<UserModel, string>;

  public removeUser!: BelongsToManyRemoveAssociationMixin<UserModel, string>;
}

GroupModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    permissions: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  },
  { sequelize, modelName: 'group' }
);

export default GroupModel;
