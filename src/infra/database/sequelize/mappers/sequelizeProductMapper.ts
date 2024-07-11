import { Product } from '@/domain/entities/Product'
import { SequelizeProductSchema } from '../models/schemas/sequelizeProductSchema'
import { SequelizeProductModel } from '../models/Product'

export class SequelizeProductMapper {
  static toDataBase(product: Product): SequelizeProductSchema {
    return {
      id: product.id,
      userId: product.userId,
      name: product.name,
      imageUrl: product.imageUrl,
      description: product.description,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt ?? undefined,
    }
  }

  static toDomain(raw: SequelizeProductModel): Product {
    return Product.create(
      {
        userId: raw.userId,
        name: raw.name,
        imageUrl: raw.imageUrl,
        description: raw.description,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? null,
      },
      raw.id,
    )
  }
}
