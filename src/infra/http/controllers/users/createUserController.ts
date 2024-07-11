import { IHasher } from '@/domain/application/cryptography/hasher'
import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { UserAlreadyExistsError } from '@/domain/application/useCases/_errors/UserAlreadyExistsError'
import { CreateUserUseCase } from '@/domain/application/useCases/user/createUser'
import { BcryptHasher } from '@/infra/cryptography/bcryptHasher'
import { SequelizeUsersRepository } from '@/infra/database/sequelize/repositories/sequelizeUsersRepository'
import { Request, Response } from 'express'
import { z } from 'zod'

const createUserBodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().min(1).max(200),
  password: z.string().min(1).max(200),
})

export class CreateUserController {
  private repository: IUsersRepository = new SequelizeUsersRepository()
  private hasher: IHasher = new BcryptHasher()
  private useCase: CreateUserUseCase = new CreateUserUseCase(
    this.repository,
    this.hasher,
  )

  async handle(request: Request, response: Response) {
    const { email, name, password } = createUserBodySchema.parse(request.body)

    try {
      await this.useCase.execute({ email, name, password })
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return response.status(409).send({
          message: error.message,
        })
      }
      return response.status(400).send({
        message: error.message,
      })
    }

    return response.status(201).send()
  }
}
