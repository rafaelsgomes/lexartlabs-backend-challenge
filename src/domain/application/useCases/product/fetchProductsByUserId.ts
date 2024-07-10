import { Product } from '@/domain/entities/Product'
import { IProductsRepository } from '../../repositories/IProductsRepository'

type FetchProductsByUserIdUseCaseRequest = {
  userId: string
  page: number
}

type FetchProductsByUserIdUseCaseResponse = {
  products: Product[]
}

export class FetchProductsByUserIdUseCase {
  constructor(private productsRepository: IProductsRepository) {}
  async execute({
    userId,
    page,
  }: FetchProductsByUserIdUseCaseRequest): Promise<FetchProductsByUserIdUseCaseResponse> {
    const products = await this.productsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      products,
    }
  }
}
