import { User } from '@/domain/entities/User'

export class UserPresenter {
  static toHttp(user: User) {
    return {
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }
  }
}
