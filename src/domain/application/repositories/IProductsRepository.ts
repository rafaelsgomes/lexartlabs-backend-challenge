import { Product } from '@/domain/entities/Product'

export interface IProductsRepository {
  create(product: Product): Promise<void>
  save(product: Product): Promise<void>
  findManyByUserId(userId: string, page: number): Promise<Product[]>
  findAllByUserId(userId: string): Promise<Product[]>
  findManyProducts(page: number): Promise<Product[]>
  findById(productId: string): Promise<Product | null>
  delete(productId: string): Promise<void>
  deleteAllByUserId(userId: string): Promise<void>
}
