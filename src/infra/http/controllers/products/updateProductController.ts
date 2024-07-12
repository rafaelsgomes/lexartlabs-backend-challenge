import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { UserNotFoundError } from '@/domain/application/useCases/_errors/UserNotFoundError'
import { UpdateProductUseCase } from '@/domain/application/useCases/product/updateProduct'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { SequelizeProductsRepository } from '@/infra/database/sequelize/repositories/sequelizeProductsRepository'
import { Request, Response } from 'express'
import { z } from 'zod'

const updateProductBodySchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(200),
  imageUrl: z.string().min(1).max(200),
})

const updateProductParamSchema = z.object({
  productId: z.string().uuid(),
})

export class UpdateProductController {
  private repository: IProductsRepository = new SequelizeProductsRepository()
  private useCase: UpdateProductUseCase = new UpdateProductUseCase(
    this.repository,
  )

  async handle(request: Request, response: Response) {
    const { name, description, imageUrl } = updateProductBodySchema.parse(
      request.body,
    )

    const { productId } = updateProductParamSchema.parse(request.params)
    const { sub } = request.user as UserPayload

    try {
      await this.useCase.execute({
        description,
        imageUrl,
        name,
        userId: sub,
        productId,
      })
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
    return response.status(204).send()
  }
}
