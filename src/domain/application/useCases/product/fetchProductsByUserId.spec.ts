import { InMemoryProductsRepository } from 'test/repositories/inMemoryProductsRepository'
import { FetchProductsByUserIdUseCase } from './fetchProductsByUserId'
import { makeProduct } from 'test/factories/makeProduct'
import { makeUser } from 'test/factories/makeUser'

let repository: InMemoryProductsRepository
let sut: FetchProductsByUserIdUseCase
describe('Fetch Products By UserId', () => {
  beforeEach(() => {
    repository = new InMemoryProductsRepository()
    sut = new FetchProductsByUserIdUseCase(repository)
  })

  it('should be able to fetch products by userId', async () => {
    const user = makeUser()

    for (let i = 1; i <= 53; i++) {
      repository.create(
        makeProduct({
          name: `product-${i}`,
          userId: user.id,
        }),
      )
    }

    const { products } = await sut.execute({
      userId: user.id,
      page: 2,
    })

    expect(products).toHaveLength(3)
  })
})
