import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { User } from '@/domain/entities/User'

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = []
  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[userIndex] = user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find((user) => user.id === userId)

    if (!user) {
      return null
    }

    return user
  }

  async delete(userId: string): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id === userId)

    this.items.splice(userIndex, 1)
  }
}
