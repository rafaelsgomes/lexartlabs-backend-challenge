import { ILogger } from '../../logger/ILogger'
import { UserLogFileNotFoundError } from '../_errors/UserLogFileNotFoundError'

type GetLogOfDeletedProductsUseCaseRequest = {
  userId: string
}

type ProductsData = {
  id: string
  name: string
  description: string
  imageUrl: string
  userId: string
  createdAt: Date
  updatedAt?: Date | null
  deletedAt: Date
}

type GetLogOfDeletedProductsUseCaseResponse = {
  products: ProductsData[]
}

export class GetLogOfDeletedProductsUseCase {
  constructor(private logger: ILogger) {}
  async execute({
    userId,
  }: GetLogOfDeletedProductsUseCaseRequest): Promise<GetLogOfDeletedProductsUseCaseResponse> {
    const productsData: ProductsData[] = await this.logger.getDataFile(
      `${userId}-deleted-products`,
    )

    if (!productsData.length) {
      throw new UserLogFileNotFoundError()
    }

    return {
      products: productsData,
    }
  }
}
