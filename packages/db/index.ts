import { sequelize } from './src/config';
import { User } from './src/models/user';
import { UserMining } from './src/models/mining';

export const db = {
  sequelize,
  User,
  UserMining
};

export default db;
