import { InMemoryUsersRepository } from "test/repositories/inMemoryUsersRepository"
import { CreateUserUseCase } from "./createUser"
import { makeUser } from "test/factories/makeUser"
import { UserAlreadyExistsError } from "../_errors/UserAlreadyExistsError"
import { InMemoryHasher } from "test/cryptography/inMemoryHasher"

let hasher: InMemoryHasher
let repository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create User', ()=> {
  beforeEach(()=> {
    hasher = new InMemoryHasher()
    repository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(repository, hasher)
  })
  it('should be able to create a new user', async ()=> {
    
    const {user} = await sut.execute({
      email: 'unit-test@email.com',
      name: 'unit test',
      password: '123456'
    })

    expect(user).toEqual(expect.objectContaining({
      email: 'unit-test@email.com'
    }))
    expect(repository.items).toHaveLength(1)
    expect(user.email).toEqual(repository.items[0].email)

  })

  it('should be able to hash password upon user creation', async ()=> {
    await sut.execute({
      email: 'unit-test@email.com',
      name: 'unit test',
      password: '123456'
    })

    const hashedPassword = await hasher.hash('123456')

    expect(repository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create a new user when email is already exists', async ()=> {
    const userOnDatabase = makeUser({
      email: 'unit-test@email.com'
    })

    await repository.create(userOnDatabase)

    expect(()=> {
      return sut.execute({
        email: 'unit-test@email.com',
        name: 'unit test',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

})