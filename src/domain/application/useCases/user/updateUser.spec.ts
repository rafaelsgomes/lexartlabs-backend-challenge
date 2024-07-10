import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { UpdateUserUseCase } from './updateUser'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { NotAllowedError } from '../_errors/NotAllowedError'
import { UserNotFoundError } from '../_errors/UserNotFoundError'

let hasher: InMemoryHasher
let repository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User', () => {
  beforeEach(() => {
    hasher = new InMemoryHasher()
    repository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(repository, hasher)
  })
  it('should be able to update a user', async () => {
    const userOnDatabase = makeUser({
      email: 'unit-test@email.com',
      password: await hasher.hash('123456'),
    })

    await repository.create(userOnDatabase)

    const { user } = await sut.execute({
      email: 'unit-test-updated@email.com',
      password: '123456',
      name: 'unit test updated',
      userId: userOnDatabase.id,
    })

    expect(user.updatedAt).toEqual(expect.any(Date))
    expect(user.name).toEqual('unit test updated')
  })

  it('should not be able to update a user that not exists', async () => {
    expect(() => {
      return sut.execute({
        email: 'unit-test-updated@email.com',
        password: '1234567',
        name: 'unit test updated',
        userId: 'userOnDatabase.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to update a user with wrong password', async () => {
    const userOnDatabase = makeUser({
      password: await hasher.hash('123456'),
    })

    await repository.create(userOnDatabase)

    expect(() => {
      return sut.execute({
        email: 'unit-test-updated@email.com',
        password: '1234567',
        name: 'unit test updated',
        userId: userOnDatabase.id,
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
