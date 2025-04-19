import { DataTypes, Model, Optional } from 'sequelize';
import { UserMiningData } from '../userMiningDataType';
import { sequelize } from '../config';

interface UserMiningAttributes {
  userId: string;
  miningData: UserMiningData;
}

interface UserMiningCreationAttributes
  extends Optional<UserMiningAttributes, 'userId'> {}

export class UserMining
  extends Model<UserMiningAttributes, UserMiningCreationAttributes>
  implements UserMiningAttributes
{
  public userId!: string;
  public miningData!: UserMiningData;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public timer?: NodeJS.Timeout | null;  
}

UserMining.init(
  {
    userId: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    miningData: {
      type: DataTypes.JSONB, // Store mining data as JSONB
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: 'user_minings',
    timestamps: true,
  }
);
