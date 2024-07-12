import { Product } from '@/domain/entities/Product'

export class ProductPresenter {
  static toHttp(product: Product) {
    return {
      name: product.name,
      description: product.description,
      image_url: product.imageUrl,
      user_id: product.userId,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    }
  }
}
