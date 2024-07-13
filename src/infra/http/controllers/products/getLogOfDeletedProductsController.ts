import { GetLogOfDeletedProductsUseCase } from '@/domain/application/useCases/product/getLogOfDeletedProducts'
import { Request, Response } from 'express'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ILogger } from '@/domain/application/logger/ILogger'
import { Logger } from '@/infra/logger/Logger'
import { ProductLogPresenter } from '../../presenters/productLogPresenter'
import { UserLogFileNotFoundError } from '@/domain/application/useCases/_errors/UserLogFileNotFoundError'

export class GetLogOfDeletedProductsController {
  private logger: ILogger = new Logger()
  private useCase: GetLogOfDeletedProductsUseCase =
    new GetLogOfDeletedProductsUseCase(this.logger)

  async handle(request: Request, response: Response) {
    const { sub } = request.user as UserPayload
    try {
      const { productsLog } = await this.useCase.execute({ userId: sub })
      return response.status(200).send({
        productsLog: productsLog.map(ProductLogPresenter.toHttp),
      })
    } catch (error) {
      if (error instanceof UserLogFileNotFoundError) {
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
