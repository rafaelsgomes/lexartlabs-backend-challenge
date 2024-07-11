import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { GetUserByIdUseCase } from '@/domain/application/useCases/user/getUserById'
import { SequelizeUsersRepository } from '@/infra/database/sequelize/repositories/sequelizeUsersRepository'
import { Request, Response } from 'express'
import { UserPresenter } from '../../presenters/userPresenter'
import { UserNotFoundError } from '@/domain/application/useCases/_errors/UserNotFoundError'
import { UserPayload } from '@/infra/auth/jwt.strategy'

export class GetUserByIdController {
  private repository: IUsersRepository = new SequelizeUsersRepository()
  private useCase: GetUserByIdUseCase = new GetUserByIdUseCase(this.repository)

  async handle(request: Request, response: Response) {
    const { sub } = request.user as UserPayload

    try {
      const { user } = await this.useCase.execute({ userId: sub })
      return response.status(200).send({
        user: UserPresenter.toHttp(user),
      })
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
