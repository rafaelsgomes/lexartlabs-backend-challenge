import { Product, ProductProps } from '@/domain/entities/Product'
import { faker } from '@faker-js/faker'

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
