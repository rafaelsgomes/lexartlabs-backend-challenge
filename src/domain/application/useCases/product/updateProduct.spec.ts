import { InMemoryProductsRepository } from 'test/repositories/inMemoryProductsRepository'
import { UpdateProductUseCase } from './updateProduct'
import { makeUser } from 'test/factories/makeUser'
import { makeProduct } from 'test/factories/makeProduct'
import { NotAllowedError } from '../_errors/NotAllowedError'
import { ProductNotFoundError } from '../_errors/ProductNotFoundError'

let repository: InMemoryProductsRepository
let sut: UpdateProductUseCase
describe('Update Product', () => {
  beforeEach(() => {
    repository = new InMemoryProductsRepository()
    sut = new UpdateProductUseCase(repository)
  })

  it('should be able to update a product', async () => {
    const user = makeUser()

    const productOnDatabase = makeProduct({
      userId: user.id,
    })

    await repository.create(productOnDatabase)

    const { product } = await sut.execute({
      description: 'unit-test-updated',
      imageUrl: 'unittest.com/image-updated.png',
      name: 'unit test updated',
      userId: user.id,
      productId: productOnDatabase.id,
    })

    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
    expect(repository.items[0].description).toEqual('unit-test-updated')
    expect(product).toEqual(repository.items[0])
  })

  it('should not be able to update a product when that does not exists', async () => {
    const productOnDatabase = makeProduct()

    await repository.create(productOnDatabase)

    expect(() => {
      return sut.execute({
        description: 'unit-test-updated',
        imageUrl: 'unittest.com/image-updated.png',
        name: 'unit test updated',
        userId: 'user.id',
        productId: 'productOnDatabase.userId',
      })
    }).rejects.toBeInstanceOf(ProductNotFoundError)
  })

  it('should not be able to update a product from another user', async () => {
    const productOnDatabase = makeProduct()

    await repository.create(productOnDatabase)

    expect(() => {
      return sut.execute({
        description: 'unit-test-updated',
        imageUrl: 'unittest.com/image-updated.png',
        name: 'unit test updated',
        userId: 'user.id',
        productId: productOnDatabase.id,
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
