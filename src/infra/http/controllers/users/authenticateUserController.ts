import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { IHasher } from '@/domain/application/cryptography/hasher'
import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { WrongCredentialsError } from '@/domain/application/useCases/_errors/WrongCredentialsError'
import { AuthenticateUserUseCase } from '@/domain/application/useCases/user/authenticateUser'
import { BcryptHasher } from '@/infra/cryptography/bcryptHasher'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'
import { SequelizeUsersRepository } from '@/infra/database/sequelize/repositories/sequelizeUsersRepository'
import { Request, Response } from 'express'
import { z } from 'zod'

const authenticateUserBodySchema = z.object({
  email: z.string().email().min(1).max(200),
  password: z.string().min(1).max(200),
})

export class AuthenticateUserController {
  private repository: IUsersRepository = new SequelizeUsersRepository()
  private hasher: IHasher = new BcryptHasher()
  private encrypter: IEncrypter = new JwtEncrypter()
  private useCase: AuthenticateUserUseCase = new AuthenticateUserUseCase(
    this.repository,
    this.hasher,
    this.encrypter,
  )

  async handle(request: Request, response: Response) {
    const { email, password } = authenticateUserBodySchema.parse(request.body)

    try {
      const { accessToken } = await this.useCase.execute({ email, password })
      return response.status(201).send({
        access_token: accessToken,
      })
    } catch (error) {
      if (error instanceof WrongCredentialsError) {
        return response.status(403).send({
          message: error.message,
        })
      }
      return response.status(400).send({
        message: error.message,
      })
    }
  }
}
