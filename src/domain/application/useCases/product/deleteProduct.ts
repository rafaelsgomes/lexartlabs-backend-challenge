import { IProductsRepository } from '../../repositories/IProductsRepository'
import { NotAllowedError } from '../_errors/NotAllowedError'
import { ProductNotFoundError } from '../_errors/ProductNotFoundError'

type DeleteProductUseCaseRequest = {
  productId: string
  userId: string
}

type DeleteProductUseCaseResponse = void

export class DeleteProductUseCaseUseCase {
  constructor(private productsRepository: IProductsRepository) {}
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
  }
}
