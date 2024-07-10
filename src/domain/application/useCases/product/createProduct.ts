import { Product } from '@/domain/entities/Product'
import { IProductsRepository } from '../../repositories/IProductsRepository'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { UserNotFoundError } from '../_errors/UserNotFoundError'

type CreateProductUseCaseRequest = {
  name: string
  description: string
  imageUrl: string
  userId: string
}

type CreateProductUseCaseResponse = {
  product: Product
}

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    description,
    imageUrl,
    name,
    userId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const product = Product.create({
      description,
      imageUrl,
      name,
      userId,
    })

    await this.productRepository.create(product)

    return {
      product,
    }
  }
}
