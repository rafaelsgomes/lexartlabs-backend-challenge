import { InMemoryProductsRepository } from 'test/repositories/inMemoryProductsRepository'
import { DeleteAllProductsByUserIdUseCase } from './deleteAllProductsByUserId'
import { makeProduct } from 'test/factories/makeProduct'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryLogger } from 'test/logger/inMemoryLogger'

let repository: InMemoryProductsRepository
let logger: InMemoryLogger
let sut: DeleteAllProductsByUserIdUseCase
describe('Delete All Products', () => {
  beforeEach(() => {
    repository = new InMemoryProductsRepository()
    logger = new InMemoryLogger()
    sut = new DeleteAllProductsByUserIdUseCase(repository, logger)
  })

  it('should be able to delete all a products', async () => {
    const user = makeUser()

    const product01OnDatabase = makeProduct({
      userId: user.id,
    })

    const product02OnDatabase = makeProduct({
      userId: user.id,
    })

    const product03OnDatabase = makeProduct()

    await Promise.all([
      repository.create(product01OnDatabase),
      repository.create(product02OnDatabase),
      repository.create(product03OnDatabase),
    ])

    await sut.execute({
      userId: user.id,
    })

    expect(repository.items).toHaveLength(1)
    expect(logger.items.length).toEqual(2)
  })
})
