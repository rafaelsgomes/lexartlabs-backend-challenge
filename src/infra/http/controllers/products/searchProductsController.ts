import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { SearchProductsUseCase } from '@/domain/application/useCases/product/searchProducts'
import { SequelizeProductsRepository } from '@/infra/database/sequelize/repositories/sequelizeProductsRepository'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductPresenter } from '../../presenters/productPresenter'
import { ProductNotFoundError } from '@/domain/application/useCases/_errors/ProductNotFoundError'

const searchProductsQuerySchema = z.object({
  q: z.string(),
})

export class SearchProductsController {
  private repository: IProductsRepository = new SequelizeProductsRepository()
  private useCase: SearchProductsUseCase = new SearchProductsUseCase(
    this.repository,
  )

  async handle(request: Request, response: Response) {
    console.log(request.query)
    const { q } = searchProductsQuerySchema.parse(request.query)
    try {
      const { products } = await this.useCase.execute({ query: q })
      return response.status(200).send({
        products: products.map(ProductPresenter.toHttp),
      })
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
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
