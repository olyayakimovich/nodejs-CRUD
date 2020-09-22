import sequelize from '../database/connection';

const UserGroup = sequelize.define('userGroup', {}, { timestamps: false });

export default UserGroup;
