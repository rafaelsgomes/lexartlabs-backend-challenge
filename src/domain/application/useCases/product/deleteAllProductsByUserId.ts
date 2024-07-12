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
  deletedAt: Date
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

    if (products.length < 1) {
      return
    }

    await this.productsRepository.deleteAllByUserId(userId)

    const data: ProductsData[] = []
    const deletedAt: Date = new Date()
    products.map((product) =>
      data.push({
        id: product.id,
        userId: product.userId,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt ?? null,
        deletedAt,
      }),
    )

    await this.logger.addDataToLogFile(`${userId}-deleted-products`, data)
  }
}
