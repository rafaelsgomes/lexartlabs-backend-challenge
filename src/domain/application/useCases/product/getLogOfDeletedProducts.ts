import { ILogger } from '../../logger/ILogger'
import { UserLogFileNotFoundError } from '../_errors/UserLogFileNotFoundError'

type GetLogOfDeletedProductsUseCaseRequest = {
  userId: string
}

export type ProductLog = {
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
  productsLog: ProductLog[]
}

export class GetLogOfDeletedProductsUseCase {
  constructor(private logger: ILogger) {}
  async execute({
    userId,
  }: GetLogOfDeletedProductsUseCaseRequest): Promise<GetLogOfDeletedProductsUseCaseResponse> {
    const productsLog: ProductLog[] = await this.logger.getDataFile(
      `${userId}-deleted-products`,
    )

    if (!productsLog.length) {
      throw new UserLogFileNotFoundError()
    }

    return {
      productsLog,
    }
  }
}
