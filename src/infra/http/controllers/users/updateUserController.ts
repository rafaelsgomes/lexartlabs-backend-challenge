import { IHasher } from '@/domain/application/cryptography/hasher'
import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { NotAllowedError } from '@/domain/application/useCases/_errors/NotAllowedError'
import { UserNotFoundError } from '@/domain/application/useCases/_errors/UserNotFoundError'
import { UpdateUserUseCase } from '@/domain/application/useCases/user/updateUser'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BcryptHasher } from '@/infra/cryptography/bcryptHasher'
import { SequelizeUsersRepository } from '@/infra/database/sequelize/repositories/sequelizeUsersRepository'
import { Request, Response } from 'express'
import { z } from 'zod'

const updateUserBodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().min(1).max(200),
  password: z.string().min(1).max(200),
})

export class UpdateUserController {
  private repository: IUsersRepository = new SequelizeUsersRepository()
  private hasher: IHasher = new BcryptHasher()
  private useCase: UpdateUserUseCase = new UpdateUserUseCase(
    this.repository,
    this.hasher,
  )

  async handle(request: Request, response: Response) {
    const { email, name, password } = updateUserBodySchema.parse(request.body)
    const { sub } = request.user as UserPayload

    try {
      await this.useCase.execute({ email, name, password, userId: sub })
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
