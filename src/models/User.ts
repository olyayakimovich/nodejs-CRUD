import {
  Model,
  DataTypes,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from 'sequelize';
import sequelize from '../database/connection';
// eslint-disable-next-line import/no-cycle
import GroupModel from './Group';

interface UserAttributes {
  id: string;
  login: string;
  password: string;
  age: number;
}

class UserModel extends Model<UserAttributes> {
  public getGroups!: BelongsToManyGetAssociationsMixin<GroupModel>;

  public addGroup!: BelongsToManyAddAssociationsMixin<GroupModel, string>;

  public removeGroup!: BelongsToManyRemoveAssociationMixin<GroupModel, string>;
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
