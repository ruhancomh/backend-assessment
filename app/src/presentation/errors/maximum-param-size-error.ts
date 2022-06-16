import { BadRequestError } from './bad-request-error'

export class MaximumParamSizeError extends BadRequestError {
  constructor (paramName: string, maximumParamSize: number) {
    super(`Param <${paramName}> exceeded the maximum size of <${maximumParamSize}>`)
    this.name = 'MaximumParamSizeError'
  }
}
