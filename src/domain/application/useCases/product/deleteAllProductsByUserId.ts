import { IProductsRepository } from '../../repositories/IProductsRepository'

type DeleteAllProductsByUserIdUseCaseRequest = {
  userId: string
}

type DeleteAllProductsByUserIdUseCaseResponse = void

export class DeleteAllProductsByUserIdUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute({
    userId,
  }: DeleteAllProductsByUserIdUseCaseRequest): Promise<DeleteAllProductsByUserIdUseCaseResponse> {
    await this.productsRepository.deleteAllByUserId(userId)
  }
}
