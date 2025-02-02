import { Product, ProductProps } from '@/domain/entities/Product'
import { SequelizeProductMapper } from '@/infra/database/sequelize/mappers/sequelizeProductMapper'
import { SequelizeProductModel } from '@/infra/database/sequelize/models/Product'
import { faker } from '@faker-js/faker'
import { ModelStatic } from 'sequelize'

export function makeProduct(override: Partial<ProductProps> = {}, id?: string) {
  const product = Product.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      imageUrl: faker.image.url(),
      userId: faker.string.uuid(),
      ...override,
    },
    id,
  )

  return product
}

export class ProductFactory {
  private model: ModelStatic<SequelizeProductModel> = SequelizeProductModel
  async makeSequelizeProduct(data: Partial<ProductProps> = {}) {
    const product = makeProduct(data)

    await this.model.create(SequelizeProductMapper.toDataBase(product))

    return product
  }
}
