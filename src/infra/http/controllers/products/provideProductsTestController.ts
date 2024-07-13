import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { UserNotFoundError } from '@/domain/application/useCases/_errors/UserNotFoundError'
import { CreateProductUseCase } from '@/domain/application/useCases/product/createProduct'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { SequelizeProductsRepository } from '@/infra/database/sequelize/repositories/sequelizeProductsRepository'
import { SequelizeUsersRepository } from '@/infra/database/sequelize/repositories/sequelizeUsersRepository'
import { Request, Response } from 'express'

export class ProvideProductsTestController {
  private repository: IProductsRepository = new SequelizeProductsRepository()
  private usersRepository: IUsersRepository = new SequelizeUsersRepository()
  private useCase: CreateProductUseCase = new CreateProductUseCase(
    this.repository,
    this.usersRepository,
  )

  async handle(request: Request, response: Response) {
    const { sub } = request.user as UserPayload

    try {
      for (let i = 1; i <= 50; i++) {
        this.useCase.execute({
          description: `Product ${i} description`,
          imageUrl: `https://samsungbrshop.vtexassets.com/arquivos/ids/228354-600-auto?v=638411055391430000&width=600&height=auto&aspect=true`,
          name: `Product ${i} name`,
          userId: sub,
        })
      }
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
