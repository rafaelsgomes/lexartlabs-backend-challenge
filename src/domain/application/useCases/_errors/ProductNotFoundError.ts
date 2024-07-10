import { IError } from '@/core/errors/IError'

export class ProductNotFoundError extends Error implements IError {
  constructor() {
    super(`Product not found.`)
  }
}
