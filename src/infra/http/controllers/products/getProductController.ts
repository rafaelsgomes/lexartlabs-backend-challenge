import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { GetProductByIdUseCase } from '@/domain/application/useCases/product/getProductById'
import { SequelizeProductsRepository } from '@/infra/database/sequelize/repositories/sequelizeProductsRepository'
import { Request, Response } from 'express'
import { z } from 'zod'
import { ProductPresenter } from '../../presenters/productPresenter'
import { ProductNotFoundError } from '@/domain/application/useCases/_errors/ProductNotFoundError'

const fetchAllProductsParamSchema = z.object({
  productId: z.string().uuid(),
})

export class GetProductByIdController {
  private repository: IProductsRepository = new SequelizeProductsRepository()
  private useCase: GetProductByIdUseCase = new GetProductByIdUseCase(
    this.repository,
  )

  async handle(request: Request, response: Response) {
    const { productId } = fetchAllProductsParamSchema.parse(request.params)
    try {
      const { product } = await this.useCase.execute({ productId })
      return response.status(200).send({
        product: ProductPresenter.toHttp(product),
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
