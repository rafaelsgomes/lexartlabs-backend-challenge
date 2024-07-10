import { Product } from '@/domain/entities/Product'
import { IProductsRepository } from '../../repositories/IProductsRepository'

type FetchProductsUseCaseRequest = {
  page: number
}

type FetchProductsUseCaseResponse = {
  products: Product[]
}

export class FetchProductsUseCase {
  constructor(private productsRepository: IProductsRepository) {}
  async execute({
    page,
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productsRepository.findManyProducts(page)

    return {
      products,
    }
  }
}
