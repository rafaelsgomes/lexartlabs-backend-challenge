import { ILogger } from '../../logger/ILogger'
import { IProductsRepository } from '../../repositories/IProductsRepository'
import { NotAllowedError } from '../_errors/NotAllowedError'
import { ProductNotFoundError } from '../_errors/ProductNotFoundError'
import { ProductLog } from './getLogOfDeletedProducts'

type DeleteProductUseCaseRequest = {
  productId: string
  userId: string
}

type DeleteProductUseCaseResponse = void

export class DeleteProductUseCase {
  constructor(
    private productsRepository: IProductsRepository,
    private logger: ILogger,
  ) {}

  async execute({
    productId,
    userId,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new ProductNotFoundError()
    }

    if (product.userId !== userId) {
      throw new NotAllowedError()
    }

    await this.productsRepository.delete(productId)

    const deletedAt: Date = new Date()
    const data: ProductLog = {
      id: product.id,
      userId: product.userId,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt ?? null,
      deletedAt,
    }

    await this.logger.addDataToLogFile(`${userId}-deleted-products`, [data])
  }
}
