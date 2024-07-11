import { IHasher } from '@/domain/application/cryptography/hasher'
import { compare as compareBcrypt, hash as hashBcrypt } from 'bcryptjs'

export class BcryptHasher implements IHasher {
  async compare(plain: string, hash: string): Promise<boolean> {
    return compareBcrypt(plain, hash)
  }

  async hash(plain: string): Promise<string> {
    return hashBcrypt(plain, 8)
  }
}
