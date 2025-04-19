import { Sequelize } from 'sequelize';
import path from 'path';


export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../../../data/database.sqlite'),
    logging: false,
  });
  