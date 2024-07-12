import { InMemoryProductsRepository } from 'test/repositories/inMemoryProductsRepository'
import { DeleteProductUseCase } from './deleteProduct'
import { makeProduct } from 'test/factories/makeProduct'
import { ProductNotFoundError } from '../_errors/ProductNotFoundError'
import { makeUser } from 'test/factories/makeUser'
import { NotAllowedError } from '../_errors/NotAllowedError'
import { InMemoryLogger } from 'test/logger/inMemoryLogger'

let repository: InMemoryProductsRepository
let logger: InMemoryLogger
let sut: DeleteProductUseCase
describe('Delete Product', () => {
  beforeEach(() => {
    repository = new InMemoryProductsRepository()
    logger = new InMemoryLogger()
    sut = new DeleteProductUseCase(repository, logger)
  })

  it('should be able to delete a product', async () => {
    const user = makeUser()

    const productOnDatabase = makeProduct({
      userId: user.id,
    })

    await repository.create(productOnDatabase)

    await sut.execute({
      productId: productOnDatabase.id,
      userId: user.id,
    })

    expect(repository.items).toHaveLength(0)
    expect(logger.total).toEqual(1)
  })

  it('should not be able to delete a product that does not exists', async () => {
    expect(() => {
      return sut.execute({
        productId: 'product.id',
        userId: 'user.id',
      })
    }).rejects.toBeInstanceOf(ProductNotFoundError)
  })

  it('should not be able to delete a product from another user', async () => {
    const productOnDatabase = makeProduct()

    await repository.create(productOnDatabase)

    expect(() => {
      return sut.execute({
        productId: productOnDatabase.id,
        userId: 'user.id',
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
