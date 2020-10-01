import { Sequelize } from 'sequelize';
import { logger } from '../utils';

const sequelize = new Sequelize('users', 'postgres', 'o', {
  host: 'localhost',
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() =>
    logger.log({
      level: 'info',
      message: 'Connection to DB has been established successfully.',
    })
  )
  .catch(() => {
    logger.log({
      level: 'error',
      message: 'Failed to connect to DB.',
    });
    process.exit(1);
  });

export default sequelize;
