import { InMemoryProductsRepository } from 'test/repositories/inMemoryProductsRepository'
import { FetchProductsUseCase } from './fetchProducts'
import { makeProduct } from 'test/factories/makeProduct'

let repository: InMemoryProductsRepository
let sut: FetchProductsUseCase
describe('Fetch Products', () => {
  beforeEach(() => {
    repository = new InMemoryProductsRepository()
    sut = new FetchProductsUseCase(repository)
  })

  it('should be able to fetch products', async () => {
    for (let i = 1; i <= 53; i++) {
      repository.create(
        makeProduct({
          name: `product-${i}`,
        }),
      )
    }

    const { products } = await sut.execute({
      page: 2,
    })

    expect(products).toHaveLength(3)
  })
})
