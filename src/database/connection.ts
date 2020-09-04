import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('users', 'postgres', 'o', {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
