import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { FetchProductsByUserIdUseCase } from '@/domain/application/useCases/product/fetchProductsByUserId'
import { SequelizeProductsRepository } from '@/infra/database/sequelize/repositories/sequelizeProductsRepository'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductPresenter } from '../../presenters/productPresenter'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const fetchAllProductsQuerySchema = z.object({
  page: z.coerce.number().default(1),
})

export class FetchProductsByUserIdController {
  private repository: IProductsRepository = new SequelizeProductsRepository()
  private useCase: FetchProductsByUserIdUseCase =
    new FetchProductsByUserIdUseCase(this.repository)

  async handle(request: Request, response: Response) {
    const { page } = fetchAllProductsQuerySchema.parse(request.query)
    const { sub } = request.user as UserPayload
    try {
      const { products } = await this.useCase.execute({ page, userId: sub })
      return response.status(200).send({
        products: products.map(ProductPresenter.toHttp),
      })
    } catch (error) {
      return response.status(400).send({
        message: error.message,
      })
    }
  }
}
