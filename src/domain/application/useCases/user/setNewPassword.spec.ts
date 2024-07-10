import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { SetNewPasswordUseCase } from './setNewPassword'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { NotAllowedError } from '../_errors/NotAllowedError'
import { UserNotFoundError } from '../_errors/UserNotFoundError'

let hasher: InMemoryHasher
let repository: InMemoryUsersRepository
let sut: SetNewPasswordUseCase

describe('Set New Password User', () => {
  beforeEach(() => {
    hasher = new InMemoryHasher()
    repository = new InMemoryUsersRepository()
    sut = new SetNewPasswordUseCase(repository, hasher)
  })
  it('should be able to set a new password a user', async () => {
    const userOnDatabase = makeUser({
      email: 'unit-test@email.com',
      password: await hasher.hash('123456'),
    })

    await repository.create(userOnDatabase)

    await sut.execute({
      userId: userOnDatabase.id,
      oldPassword: '123456',
      newPassword: '1234567',
    })

    const newPasswordHashed = await hasher.hash('1234567')

    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
    expect(repository.items[0].password).toEqual(newPasswordHashed)
  })

  it('should not be able to set a new password for a user that not exists', async () => {
    expect(() => {
      return sut.execute({
        userId: 'userOnDatabase.id',
        oldPassword: '123456',
        newPassword: '1234567',
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
        userId: userOnDatabase.id,
        oldPassword: '12345',
        newPassword: '1234567',
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
