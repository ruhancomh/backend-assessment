import { ApiError } from '../protocols/api-error'

export class BaseApiError extends Error implements ApiError {
  statusCode: number

  toJSON (): Object {
    return {
      message: this.message,
      name: this.name,
      statusCode: this.statusCode
    }
  }
}
