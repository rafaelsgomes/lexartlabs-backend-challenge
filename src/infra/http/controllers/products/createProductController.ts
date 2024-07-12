import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { UserNotFoundError } from '@/domain/application/useCases/_errors/UserNotFoundError'
import { CreateProductUseCase } from '@/domain/application/useCases/product/createProduct'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { SequelizeProductsRepository } from '@/infra/database/sequelize/repositories/sequelizeProductsRepository'
import { SequelizeUsersRepository } from '@/infra/database/sequelize/repositories/sequelizeUsersRepository'
import { Request, Response } from 'express'
import { z } from 'zod'

const createProductBodySchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(200),
  imageUrl: z.string().min(1).max(200),
})

export class CreateProductController {
  private repository: IProductsRepository = new SequelizeProductsRepository()
  private usersRepository: IUsersRepository = new SequelizeUsersRepository()
  private useCase: CreateProductUseCase = new CreateProductUseCase(
    this.repository,
    this.usersRepository,
  )

  async handle(request: Request, response: Response) {
    const { name, description, imageUrl } = createProductBodySchema.parse(
      request.body,
    )
    const { sub } = request.user as UserPayload

    try {
      await this.useCase.execute({ description, imageUrl, name, userId: sub })
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
    return response.status(201).send()
  }
}
