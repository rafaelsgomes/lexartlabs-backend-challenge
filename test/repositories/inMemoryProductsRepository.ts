import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { Product } from '@/domain/entities/Product'

export class InMemoryProductsRepository implements IProductsRepository {
  public items: Product[] = []

  async create(product: Product): Promise<void> {
    this.items.push(product)
  }

  async save(product: Product): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === product.id)

    this.items[productIndex] = product
  }

  async findManyByUserId(userId: string, page: number): Promise<Product[]> {
    const products = this.items
      .filter((item) => item.userId === userId)
      .slice((page - 1) * 50, page * 50)
    return products
  }

  async findAllByUserId(userId: string): Promise<Product[]> {
    const products = this.items.filter((item) => item.userId === userId)
    return products
  }

  async findManyProducts(page: number): Promise<Product[]> {
    const products = this.items.slice((page - 1) * 50, page * 50)
    return products
  }

  async findById(productId: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id === productId)

    if (!product) {
      return null
    }

    return product
  }

  async search(query: string): Promise<Product[]> {
    const products = this.items.filter(
      (item) => item.name.includes(query) || item.description.includes(query),
    )
    return products
  }

  async delete(productId: string): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === productId)

    this.items.splice(productIndex, 1)
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const products = this.items.filter((item) => item.userId === userId)

    products.forEach((product) => {
      const productIndex = this.items.findIndex(
        (item) => item.id === product.id,
      )
      this.items.splice(productIndex, 1)
    })
  }
}
