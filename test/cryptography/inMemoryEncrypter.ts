import { IEncrypter } from "@/domain/application/cryptography/encrypter";

export class InMemoryEncrypter implements IEncrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}