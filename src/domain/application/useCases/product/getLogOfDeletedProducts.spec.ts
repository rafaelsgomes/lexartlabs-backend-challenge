import { GetLogOfDeletedProductsUseCase } from './getLogOfDeletedProducts'
import { makeProduct } from 'test/factories/makeProduct'
import { InMemoryLogger } from 'test/logger/inMemoryLogger'
import { randomUUID } from 'node:crypto'
import { UserLogFileNotFoundError } from '../_errors/UserLogFileNotFoundError'

let logger: InMemoryLogger
let sut: GetLogOfDeletedProductsUseCase
describe('Get log of deleted products', () => {
  beforeEach(() => {
    logger = new InMemoryLogger()
    sut = new GetLogOfDeletedProductsUseCase(logger)
  })

  it('should be able to get a log of the deleted products', async () => {
    const userId = randomUUID()
    const product = makeProduct({
      userId,
    })

    logger.items.push({
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      userId: product.userId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: new Date(),
    })

    const { products } = await sut.execute({
      userId,
    })

    expect(products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: product.name,
          description: product.description,
        }),
      ]),
    )
  })

  it('should not be able to get a log of the deleted products that does not exists', async () => {
    expect(() => {
      return sut.execute({
        userId: 'user.id',
      })
    }).rejects.toBeInstanceOf(UserLogFileNotFoundError)
  })
})
