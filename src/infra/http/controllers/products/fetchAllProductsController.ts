import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { FetchProductsUseCase } from '@/domain/application/useCases/product/fetchProducts'
import { SequelizeProductsRepository } from '@/infra/database/sequelize/repositories/sequelizeProductsRepository'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductPresenter } from '../../presenters/productPresenter'

const fetchAllProductsQuerySchema = z.object({
  page: z.coerce.number().default(1),
})

export class FetchAllProductsController {
  private repository: IProductsRepository = new SequelizeProductsRepository()
  private useCase: FetchProductsUseCase = new FetchProductsUseCase(
    this.repository,
  )

  async handle(request: Request, response: Response) {
    const { page } = fetchAllProductsQuerySchema.parse(request.query)
    try {
      const { products } = await this.useCase.execute({ page })
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
