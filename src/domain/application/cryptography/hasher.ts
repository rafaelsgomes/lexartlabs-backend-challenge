export interface IHasher {
  compare(plain: string, hash: string): Promise<boolean>
  hash(plain: string): Promise<string>
}
