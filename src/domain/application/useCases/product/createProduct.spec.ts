import { InMemoryProductsRepository } from 'test/repositories/inMemoryProductsRepository'
import { CreateProductUseCase } from './createProduct'
import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { makeUser } from 'test/factories/makeUser'
import { UserNotFoundError } from '../_errors/UserNotFoundError'

let inMemoryUsersRepository: InMemoryUsersRepository
let repository: InMemoryProductsRepository
let sut: CreateProductUseCase
describe('Create Product', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    repository = new InMemoryProductsRepository()
    sut = new CreateProductUseCase(repository, inMemoryUsersRepository)
  })

  it('should be able to create a new product', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const { product } = await sut.execute({
      description: 'unit-test',
      imageUrl: 'unittest.com/image.png',
      name: 'unit test',
      userId: user.id,
    })

    expect(repository.items).toHaveLength(1)
    expect(product).toEqual(repository.items[0])
  })

  it('should not be able to create a new product when user does not exists', async () => {
    expect(() => {
      return sut.execute({
        description: 'unit-test',
        imageUrl: 'unittest.com/image.png',
        name: 'unit test',
        userId: 'user.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
