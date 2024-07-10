import { User } from '@/domain/entities/User'

export interface IUsersRepository {
  create(user: User): Promise<void>
  save(user: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
  delete(userId: string): Promise<void>
}
