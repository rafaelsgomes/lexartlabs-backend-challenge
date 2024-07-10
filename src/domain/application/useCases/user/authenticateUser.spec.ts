import { InMemoryUsersRepository } from "test/repositories/inMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./authenticateUser"
import { makeUser } from "test/factories/makeUser"
import { UserAlreadyExistsError } from "../_errors/UserAlreadyExistsError"
import { InMemoryHasher } from "test/cryptography/inMemoryHasher"
import { InMemoryEncrypter } from "test/cryptography/inMemoryEncrypter"
import { WrongCredentialsError } from "../_errors/WrongCredentialsError"

let hasher: InMemoryHasher
let encrypter: InMemoryEncrypter
let repository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Create User', ()=> {
  beforeEach(()=> {
    hasher = new InMemoryHasher()
    encrypter = new InMemoryEncrypter()
    repository = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(repository, hasher, encrypter)
  })
  it('should be able to authenticate a user', async ()=> {
    const userOnDatabase = makeUser({
      email: 'unit-test@email.com',
      password: await hasher.hash('123456')
    })

    await repository.create(userOnDatabase)

    const {accessToken} = await sut.execute({
      email: 'unit-test@email.com',
      password: '123456'
    })

    expect(accessToken).toEqual(expect.any(String))
  })

  it('should not be able to authenticate a user with wrong email', async ()=> {
    const userOnDatabase = makeUser({
      password: await hasher.hash('123456')
    })

    await repository.create(userOnDatabase)

    expect(()=> {
      return sut.execute({
        email: 'unit-test@email.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate a user with wrong password', async ()=> {
    const userOnDatabase = makeUser({
      email: 'unit-test@email.com'
    })

    await repository.create(userOnDatabase)

    expect(()=> {
      return sut.execute({
        email: 'unit-test@email.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(WrongCredentialsError)
  })

})