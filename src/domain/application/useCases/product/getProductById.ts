import { Product } from '@/domain/entities/Product'
import { IProductsRepository } from '../../repositories/IProductsRepository'
import { ProductNotFoundError } from '../_errors/ProductNotFoundError'

type GetProductByIdUseCaseRequest = {
  productId: string
}

type GetProductByIdUseCaseResponse = {
  product: Product
}

export class GetProductByIdUseCase {
  constructor(private productsRepository: IProductsRepository) {}
  async execute({
    productId,
  }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new ProductNotFoundError()
    }

    return {
      product,
    }
  }
}
