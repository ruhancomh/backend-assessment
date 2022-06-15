import { ApiError } from '../protocols/api-error'

export class InternalServerError extends Error implements ApiError {
  statusCode: number

  constructor () {
    super('Internal Server Error')
    this.name = 'ServerError'
    this.statusCode = 500
  }
}
