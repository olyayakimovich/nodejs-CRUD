import { Model, DataTypes, BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin } from 'sequelize';
import sequelize from '../database/connection';
import { Group } from '../types';
// eslint-disable-next-line import/no-cycle
import UserModel from './User';

class GroupModel extends Model<Group> {
  public getUsers!: BelongsToManyGetAssociationsMixin<UserModel>;

  public removeUsers!: BelongsToManyRemoveAssociationMixin<UserModel, string[]>;
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
