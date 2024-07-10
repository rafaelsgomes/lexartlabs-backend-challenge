import { User } from "@/domain/entities/User"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { UserAlreadyExistsError } from "../_errors/UserAlreadyExistsError"
import { IHasher } from "../../cryptography/hasher"

type CreateUserUseCaseRequest = {
  name: string
  email: string
  password: string
}

type CreateUserUseCaseResponse = {
  user: User
}

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHasher
  ){}
  async execute({email,name, password}: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse>{
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if(userAlreadyExists){
      throw new UserAlreadyExistsError(email)
    }

    const passwordHash = await this.hasher.hash(password)

    const user = User.create({email, name, password: passwordHash})

    await this.usersRepository.create(user)

    return {
      user,
    }
  }
}