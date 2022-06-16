import { BadRequestError } from './bad-request-error'

export class RequiredAlphanumericParamError extends BadRequestError {
  constructor (paramName: string) {
    super(`Param <${paramName}> only accepts alphanumeric values`)
    this.name = 'RequiredAlphanumericParamError'
  }
}
