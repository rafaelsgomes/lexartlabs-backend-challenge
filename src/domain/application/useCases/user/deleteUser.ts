import { IUsersRepository } from '../../repositories/IUsersRepository'
import { UserNotFoundError } from '../_errors/UserNotFoundError'

type DeleteUserUseCaseRequest = {
  userId: string
}

type DeleteUserUseCaseResponse = void

export class DeleteUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    await this.usersRepository.delete(userId)
  }
}
