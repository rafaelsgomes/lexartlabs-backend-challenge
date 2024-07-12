import { IError } from '@/core/errors/IError'

export class UserLogFileNotFoundError extends Error implements IError {
  constructor() {
    super(`User log file not found.`)
  }
}
