import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { DeleteUserUseCase } from './deleteUser'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { UserNotFoundError } from '../_errors/UserNotFoundError'

let hasher: InMemoryHasher
let repository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User', () => {
  beforeEach(() => {
    hasher = new InMemoryHasher()
    repository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(repository)
  })
  it('should be able to delete a user', async () => {
    const userOnDatabase = makeUser({
      email: 'unit-test@email.com',
      password: await hasher.hash('123456'),
    })

    await repository.create(userOnDatabase)

    await sut.execute({
      userId: userOnDatabase.id,
    })

    expect(repository.items[0]).toBeUndefined()
  })

  it('should not be able delete a non existing user', async () => {
    expect(() => {
      return sut.execute({
        userId: 'userOnDatabase.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
