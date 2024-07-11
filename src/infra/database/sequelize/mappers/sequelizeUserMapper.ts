import { User } from '@/domain/entities/User'
import { SequelizeUserSchema } from '../models/schemas/sequelizeUserSchema'
import { SequelizeUserModel } from '../models/User'

export class SequelizeUserMapper {
  static toDataBase(user: User): SequelizeUserSchema {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? undefined,
    }
  }

  static toDomain(raw: SequelizeUserModel): User {
    return User.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? null,
      },
      raw.id,
    )
  }
}
