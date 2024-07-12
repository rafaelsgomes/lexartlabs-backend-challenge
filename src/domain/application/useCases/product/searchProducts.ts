import { Product } from '@/domain/entities/Product'
import { IProductsRepository } from '../../repositories/IProductsRepository'
import { ProductNotFoundError } from '../_errors/ProductNotFoundError'

type SearchProductsUseCaseRequest = {
  query: string
}

type SearchProductsUseCaseResponse = {
  products: Product[]
}

export class SearchProductsUseCase {
  constructor(private productsRepository: IProductsRepository) {}
  async execute({
    query,
  }: SearchProductsUseCaseRequest): Promise<SearchProductsUseCaseResponse> {
    const products = await this.productsRepository.search(query)

    if (!products.length) {
      throw new ProductNotFoundError()
    }

    return {
      products,
    }
  }
}
