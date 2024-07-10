import { IEncrypter } from "../../cryptography/encrypter";
import { IHasher } from "../../cryptography/hasher";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { WrongCredentialsError } from "../_errors/WrongCredentialsError";

type AuthenticateUserUseCaseRequest = {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = {
  accessToken: string
}

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHasher,
    private encrypter: IEncrypter
  ){}
  async execute({email, password}: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse>{
    const user = await this.usersRepository.findByEmail(email)

    if(!user){
      throw new WrongCredentialsError()
    }

    const isPasswordMatch = await this.hasher.compare(password, user.password)

    if(!isPasswordMatch){
      throw new WrongCredentialsError()
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id
    })

    return {
      accessToken
    }

  }
}