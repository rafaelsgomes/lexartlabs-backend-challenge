import { IHasher } from '@/domain/application/cryptography/hasher'
import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { NotAllowedError } from '@/domain/application/useCases/_errors/NotAllowedError'
import { UserNotFoundError } from '@/domain/application/useCases/_errors/UserNotFoundError'
import { SetNewPasswordUseCase } from '@/domain/application/useCases/user/setNewPassword'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BcryptHasher } from '@/infra/cryptography/bcryptHasher'
import { SequelizeUsersRepository } from '@/infra/database/sequelize/repositories/sequelizeUsersRepository'
import { Request, Response } from 'express'
import { z } from 'zod'

const setNewPasswordBodySchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(1).max(200),
})

export class SetNewPasswordController {
  private repository: IUsersRepository = new SequelizeUsersRepository()
  private hasher: IHasher = new BcryptHasher()
  private useCase: SetNewPasswordUseCase = new SetNewPasswordUseCase(
    this.repository,
    this.hasher,
  )

  async handle(request: Request, response: Response) {
    const { currentPassword, newPassword } = setNewPasswordBodySchema.parse(
      request.body,
    )
    const { sub } = request.user as UserPayload

    try {
      await this.useCase.execute({
        userId: sub,
        oldPassword: currentPassword,
        newPassword,
      })
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return response.status(404).send({
          message: error.message,
        })
      }
      if (error instanceof NotAllowedError) {
        return response.status(403).send({
          message: error.message,
        })
      }
      return response.status(400).send({
        message: error.message,
      })
    }

    return response.status(204).send()
  }
}
