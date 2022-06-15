import { ApiError } from '../protocols/api-error'

export class ResourceNotFoundError extends Error implements ApiError {
  statusCode: number

  constructor (message: string) {
    super(message)
    this.name = 'ResourceNotFoundError'
    this.statusCode = 404
  }
}
