import { Product } from '@/domain/entities/Product'

export interface IProductsRepository {
  create(product: Product): Promise<void>
  save(product: Product): Promise<void>
  findManyByUserId(userId: string): Promise<Product[]>
  findById(productId: string): Promise<Product | null>
  delete(productId: string): Promise<void>
  deleteAllByUserId(userId: string): Promise<void>
}
