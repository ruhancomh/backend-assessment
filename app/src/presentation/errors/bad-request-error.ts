import { BaseApiError } from './base-api-error'

export class BadRequestError extends BaseApiError {
  constructor (message: string) {
    super(message)
    this.name = 'BadRequestError'
    this.statusCode = 400
  }
}
