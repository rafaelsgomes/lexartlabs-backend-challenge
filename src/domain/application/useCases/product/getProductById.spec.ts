import { InMemoryProductsRepository } from 'test/repositories/inMemoryProductsRepository'
import { GetProductByIdUseCase } from './getProductById'
import { makeProduct } from 'test/factories/makeProduct'
import { ProductNotFoundError } from '../_errors/ProductNotFoundError'

let repository: InMemoryProductsRepository
let sut: GetProductByIdUseCase
describe('Get Product', () => {
  beforeEach(() => {
    repository = new InMemoryProductsRepository()
    sut = new GetProductByIdUseCase(repository)
  })

  it('should be able to get a product', async () => {
    const productOnDatabase = makeProduct()

    await repository.create(productOnDatabase)

    const { product } = await sut.execute({
      productId: productOnDatabase.id,
    })

    expect(product).toEqual(repository.items[0])
  })

  it('should not be able to get a product that does not exists', async () => {
    expect(() => {
      return sut.execute({
        productId: 'product.id',
      })
    }).rejects.toBeInstanceOf(ProductNotFoundError)
  })
})
