import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { GetUserByIdUseCase } from './getUserById'
import { makeUser } from 'test/factories/makeUser'
import { UserNotFoundError } from '../_errors/UserNotFoundError'

let repository: InMemoryUsersRepository
let sut: GetUserByIdUseCase

describe('Get User', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new GetUserByIdUseCase(repository)
  })
  it('should be able to get a user by id', async () => {
    const userOnDatabase = makeUser({
      email: 'unit-test@email.com',
    })

    await repository.create(userOnDatabase)

    const { user } = await sut.execute({
      userId: userOnDatabase.id,
    })

    expect(user).toEqual(userOnDatabase)
  })

  it('should not be able to get a user that not exists', async () => {
    expect(() => {
      return sut.execute({
        userId: 'user.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
