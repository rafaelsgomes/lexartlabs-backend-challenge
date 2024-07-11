import { CreationOptional, DataTypes, Model } from 'sequelize'
import { SequelizeProductSchema } from './schemas/sequelizeProductSchema'
import { SequelizeConnection } from '..'

export class SequelizeProductModel extends Model<SequelizeProductSchema> {
  declare id: string
  declare userId: string
  declare name: string
  declare description: string
  declare imageUrl: string
  declare createdAt: Date
  declare updatedAt: CreationOptional<Date>
}

const sequelize = SequelizeConnection.getInstance()

SequelizeProductModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
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
    tableName: 'products',
    underscored: true,
    sequelize,
  },
)
