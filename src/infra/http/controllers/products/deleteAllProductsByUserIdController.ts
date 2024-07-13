import { ILogger } from '@/domain/application/logger/ILogger'
import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { NotAllowedError } from '@/domain/application/useCases/_errors/NotAllowedError'
import { ProductNotFoundError } from '@/domain/application/useCases/_errors/ProductNotFoundError'
import { DeleteAllProductsByUserIdUseCase } from '@/domain/application/useCases/product/deleteAllProductsByUserId'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { SequelizeProductsRepository } from '@/infra/database/sequelize/repositories/sequelizeProductsRepository'
import { Logger } from '@/infra/logger/Logger'
import { Request, Response } from 'express'

export class DeleteAllProductsByUserIdController {
  private repository: IProductsRepository = new SequelizeProductsRepository()
  private logger: ILogger = new Logger()
  private useCase: DeleteAllProductsByUserIdUseCase =
    new DeleteAllProductsByUserIdUseCase(this.repository, this.logger)

  async handle(request: Request, response: Response) {
    const { sub } = request.user as UserPayload

    try {
      this.useCase.execute({
        userId: sub,
      })
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
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
