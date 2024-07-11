import jwt from 'jsonwebtoken'
import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { env } from '../env'

export class JwtEncrypter implements IEncrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return jwt.sign(payload, Buffer.from(env.JWT_PRIVATE_KEY, 'base64'), {
      expiresIn: '1d',
      algorithm: 'RS256',
    })
  }
}
