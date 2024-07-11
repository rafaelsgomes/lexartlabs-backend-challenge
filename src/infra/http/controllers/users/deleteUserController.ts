import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { DeleteUserUseCase } from '@/domain/application/useCases/user/deleteUser'
import { SequelizeUsersRepository } from '@/infra/database/sequelize/repositories/sequelizeUsersRepository'
import { Request, Response } from 'express'
import { UserNotFoundError } from '@/domain/application/useCases/_errors/UserNotFoundError'
import { UserPayload } from '@/infra/auth/jwt.strategy'

export class DeleteUserController {
  private repository: IUsersRepository = new SequelizeUsersRepository()
  private useCase: DeleteUserUseCase = new DeleteUserUseCase(this.repository)

  async handle(request: Request, response: Response) {
    const { sub } = request.user as UserPayload

    try {
      await this.useCase.execute({ userId: sub })
      return response.status(200).send()
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return response.status(404).send({
          message: error.message,
        })
      }
      return response.status(400).send({
        message: error.message,
      })
    }
  }
}
