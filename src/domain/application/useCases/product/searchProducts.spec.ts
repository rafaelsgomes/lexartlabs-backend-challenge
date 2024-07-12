import { InMemoryProductsRepository } from 'test/repositories/inMemoryProductsRepository'
import { SearchProductsUseCase } from './searchProducts'
import { makeProduct } from 'test/factories/makeProduct'
import { ProductNotFoundError } from '../_errors/ProductNotFoundError'

let repository: InMemoryProductsRepository
let sut: SearchProductsUseCase
describe('Search Products', () => {
  beforeEach(() => {
    repository = new InMemoryProductsRepository()
    sut = new SearchProductsUseCase(repository)
  })

  it('should be able to search a products', async () => {
    await Promise.all([
      repository.create(makeProduct({ name: 'name test' })),
      repository.create(makeProduct({ description: 'description test' })),
      repository.create(makeProduct()),
    ])

    const { products } = await sut.execute({
      query: 'test',
    })

    expect(products.length).toEqual(2)
  })

  it('should not be able to search a products that does not exists', async () => {
    expect(() => {
      return sut.execute({
        query: 'query',
      })
    }).rejects.toBeInstanceOf(ProductNotFoundError)
  })
})
