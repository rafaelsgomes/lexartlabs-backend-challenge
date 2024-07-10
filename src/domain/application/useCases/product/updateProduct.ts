import { Product } from '@/domain/entities/Product'
import { IProductsRepository } from '../../repositories/IProductsRepository'
import { ProductNotFoundError } from '../_errors/ProductNotFoundError'
import { NotAllowedError } from '../_errors/NotAllowedError'

type UpdateProductUseCaseRequest = {
  productId: string
  userId: string
  name: string
  description: string
  imageUrl: string
}

type UpdateProductUseCaseResponse = {
  product: Product
}

export class UpdateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}
  async execute({
    productId,
    name,
    description,
    imageUrl,
    userId,
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new ProductNotFoundError()
    }

    if (product.userId !== userId) {
      throw new NotAllowedError()
    }

    product.description = description
    product.imageUrl = imageUrl
    product.name = name

    await this.productsRepository.save(product)

    return {
      product,
    }
  }
}
