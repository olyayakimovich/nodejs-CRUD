import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection';

interface UserAttributes {
  id: string;
  login: string;
  password: string;
  age: number;
}

class User extends Model<UserAttributes> {}
User.init(
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

export default User;
