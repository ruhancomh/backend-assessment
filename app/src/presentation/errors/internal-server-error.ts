import { BaseApiError } from './base-api-error'

export class InternalServerError extends BaseApiError {
  constructor () {
    super('Internal Server Error')
    this.name = 'InternalServerError'
    this.statusCode = 500
  }
}
