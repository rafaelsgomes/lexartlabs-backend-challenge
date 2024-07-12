import { IProductsRepository } from '@/domain/application/repositories/IProductsRepository'
import { Product } from '@/domain/entities/Product'
import { SequelizeProductModel } from '../models/Product'
import { SequelizeProductMapper } from '../mappers/sequelizeProductMapper'
import { ModelStatic } from 'sequelize'

export class SequelizeProductsRepository implements IProductsRepository {
  private model: ModelStatic<SequelizeProductModel> = SequelizeProductModel
  async create(product: Product): Promise<void> {
    await this.model.create(SequelizeProductMapper.toDataBase(product))
  }

  async save(product: Product): Promise<void> {
    await this.model.update(SequelizeProductMapper.toDataBase(product), {
      where: {
        id: product.id,
      },
    })
  }

  async findManyByUserId(userId: string, page: number): Promise<Product[]> {
    const products = await this.model.findAll({
      where: {
        userId,
      },
      limit: 50,
      offset: (page - 1) * 50,
    })

    return products.map(SequelizeProductMapper.toDomain)
  }

  async findAllByUserId(userId: string): Promise<Product[]> {
    const products = await this.model.findAll({
      where: {
        userId,
      },
    })

    return products.map(SequelizeProductMapper.toDomain)
  }

  async findManyProducts(page: number): Promise<Product[]> {
    const products = await this.model.findAll({
      limit: 50,
      offset: (page - 1) * 50,
    })

    return products.map(SequelizeProductMapper.toDomain)
  }

  async findById(productId: string): Promise<Product | null> {
    const product = await this.model.findByPk(productId)

    if (!product) {
      return null
    }

    return SequelizeProductMapper.toDomain(product)
  }

  async delete(productId: string): Promise<void> {
    await this.model.destroy({ where: { id: productId } })
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.model.destroy({ where: { userId } })
  }
}
