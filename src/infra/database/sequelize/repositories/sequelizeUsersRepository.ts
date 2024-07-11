import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { User } from '@/domain/entities/User'
import { SequelizeUserModel } from '../models/User'
import { SequelizeUserMapper } from '../mappers/sequelizeUserMapper'
import { ModelStatic } from 'sequelize'

export class SequelizeUsersRepository implements IUsersRepository {
  private model: ModelStatic<SequelizeUserModel> = SequelizeUserModel
  async create(user: User): Promise<void> {
    await this.model.create(SequelizeUserMapper.toDataBase(user))
  }

  async save(user: User): Promise<void> {
    await this.model.update(SequelizeUserMapper.toDataBase(user), {
      where: {
        id: user.id,
      },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.model.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return SequelizeUserMapper.toDomain(user)
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.model.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return null
    }

    return SequelizeUserMapper.toDomain(user)
  }

  async delete(userId: string): Promise<void> {
    await this.model.destroy({ where: { id: userId } })
  }
}
