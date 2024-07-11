import { CreationOptional, DataTypes, Model } from 'sequelize'
import { SequelizeUserSchema } from './schemas/sequelizeUserSchema'
import { SequelizeConnection } from '..'

export class SequelizeUserModel extends Model<SequelizeUserSchema> {
  declare id: string
  declare name: string
  declare email: string
  declare password: string
  declare createdAt: Date
  declare updatedAt: CreationOptional<Date>
}

const sequelize = SequelizeConnection.getInstance()

SequelizeUserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    underscored: true,
    sequelize,
  },
)
