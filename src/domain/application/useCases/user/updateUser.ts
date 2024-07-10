import { User } from '@/domain/entities/User'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { UserNotFoundError } from '../_errors/UserNotFoundError'
import { IHasher } from '../../cryptography/hasher'
import { NotAllowedError } from '../_errors/NotAllowedError'

type UpdateUserUseCaseRequest = {
  userId: string
  name: string
  email: string
  password: string
}

type UpdateUserUseCaseResponse = {
  user: User
}

export class UpdateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    email,
    name,
    password,
    userId,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const isPasswordMatch = await this.hasher.compare(password, user.password)

    if (!isPasswordMatch) {
      throw new NotAllowedError()
    }

    user.email = email
    user.name = name

    await this.usersRepository.save(user)

    return {
      user,
    }
  }
}
