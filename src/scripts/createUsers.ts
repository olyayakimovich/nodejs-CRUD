import sequelize from '../database/connection';

sequelize
  .query(
    // eslint-disable-next-line max-len
    "INSERT INTO users (id, login, password, age) VALUES ('9b864063-eff8-48de-9778-4c2e6b0feba9', 'user1', '12345ghj', 30), ('9b864063-eff8-48de-9778-4c2e6b0feba3', 'user2', '12345ghj', 40), ('9b864063-eff8-48de-9778-4c2e6b0feba4', 'user3', 'tyu367ss', 19), ('9b864063-eff8-48de-9778-4c2e6b0feba5', 'user4', '123wert', 90)",
    {
      logging: console.log,
    }
  )
  .then(() => sequelize.close());
