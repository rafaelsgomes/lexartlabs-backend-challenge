import { User, UserProps } from '@/domain/entities/User'
import { SequelizeUserMapper } from '@/infra/database/sequelize/mappers/sequelizeUserMapper'
import { SequelizeUserModel } from '@/infra/database/sequelize/models/User'
import { faker } from '@faker-js/faker'
import { ModelStatic } from 'sequelize'

export function makeUser(override: Partial<UserProps> = {}, id?: string) {
  const user = User.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({
        length: 20,
      }),
      ...override,
    },
    id,
  )

  return user
}

export class UserFactory {
  private model: ModelStatic<SequelizeUserModel> = SequelizeUserModel
  async makeSequelizeUser(data: Partial<UserProps> = {}) {
    const user = makeUser(data)

    await this.model.create(SequelizeUserMapper.toDataBase(user))

    return user
  }
}
