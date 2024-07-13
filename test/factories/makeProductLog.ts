import { ILogger } from '@/domain/application/logger/ILogger'
import { ProductLog } from '@/domain/application/useCases/product/getLogOfDeletedProducts'
import { Logger } from '@/infra/logger/Logger'
import { faker } from '@faker-js/faker'

export function makeProductLog(override: Partial<ProductLog> = {}) {
  const productLog = {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    imageUrl: faker.image.url(),
    userId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    ...override,
  }

  return productLog
}

export class ProductLogFactory {
  private logger: ILogger = new Logger()
  async makeProductLogFile(data: Partial<ProductLog> = {}) {
    const productLog = makeProductLog(data)

    await this.logger.addDataToLogFile(
      `${productLog.userId}-deleted-products`,
      [productLog],
    )

    return productLog
  }
}
