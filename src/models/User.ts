import {
  Model,
  DataTypes,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from 'sequelize';
import sequelize from '../database/connection';
import { User } from '../types';
// eslint-disable-next-line import/no-cycle
import GroupModel from './Group';

class UserModel extends Model<User> {
  public getGroups!: BelongsToManyGetAssociationsMixin<GroupModel>;

  public addGroup!: BelongsToManyAddAssociationsMixin<GroupModel, string>;

  public removeGroups!: BelongsToManyRemoveAssociationMixin<GroupModel, string[]>;
}

UserModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: 'user' }
);

export default UserModel;
