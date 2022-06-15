import { BaseApiError } from './base-api-error'

export class ResourceNotFoundError extends BaseApiError {
  constructor (message: string) {
    super(message)
    this.name = 'ResourceNotFoundError'
    this.statusCode = 404
  }
}
