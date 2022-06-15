import { ApiError } from '../protocols/api-error'

export class BadRequestError extends Error implements ApiError {
  statusCode: number

  constructor (message: string) {
    super(message)
    this.name = 'BadRequestError'
    this.statusCode = 400
  }
}
