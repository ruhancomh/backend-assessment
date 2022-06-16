import { BadRequestError } from './bad-request-error'

export class MissingParamError extends BadRequestError {
  constructor (missingParamName: string) {
    super(`Missing param: ${missingParamName}`)
    this.name = 'MissingParamError'
  }
}
