import { User } from '@/domain/entities/User'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { UserNotFoundError } from '../_errors/UserNotFoundError'
import { IHasher } from '../../cryptography/hasher'
import { NotAllowedError } from '../_errors/NotAllowedError'

type SetNewPasswordUseCaseRequest = {
  userId: string
  oldPassword: string
  newPassword: string
}

type SetNewPasswordUseCaseResponse = {
  user: User
}

export class SetNewPasswordUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    userId,
    oldPassword,
    newPassword,
  }: SetNewPasswordUseCaseRequest): Promise<SetNewPasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const isPasswordMatch = await this.hasher.compare(
      oldPassword,
      user.password,
    )

    if (!isPasswordMatch) {
      throw new NotAllowedError()
    }

    user.password = await this.hasher.hash(newPassword)

    await this.usersRepository.save(user)

    return {
      user,
    }
  }
}
