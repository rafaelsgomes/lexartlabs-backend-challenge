import { ILogger } from '../../logger/ILogger'
import { IProductsRepository } from '../../repositories/IProductsRepository'

type DeleteAllProductsByUserIdUseCaseRequest = {
  userId: string
}

type DeleteAllProductsByUserIdUseCaseResponse = void

type ProductsData = {
  id: string
  name: string
  description: string
  imageUrl: string
  userId: string
  createdAt: Date
  updatedAt?: Date | null
}

export class DeleteAllProductsByUserIdUseCase {
  constructor(
    private productsRepository: IProductsRepository,
    private logger: ILogger,
  ) {}

  async execute({
    userId,
  }: DeleteAllProductsByUserIdUseCaseRequest): Promise<DeleteAllProductsByUserIdUseCaseResponse> {
    const products = await this.productsRepository.findAllByUserId(userId)

    await this.productsRepository.deleteAllByUserId(userId)

    const data: ProductsData[] = []

    products.map((product) =>
      data.push({
        id: product.id,
        userId: product.userId,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt ?? null,
      }),
    )

    await this.logger.addDataToLogFile(`${userId}-deleted-products`, data)
  }
}
