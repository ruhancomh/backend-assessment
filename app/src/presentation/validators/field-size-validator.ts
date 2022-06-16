import { MaximumParamSizeError } from '../errors/maximum-param-size-error'
import { HttpRequest } from '../protocols/http-request'
import { Validator } from '../protocols/validator'

export class FieldSizeValidator implements Validator {
  protected readonly fieldSizes: Map<string, number>

  constructor (fieldSizes: Map<string, number>) {
    this.fieldSizes = fieldSizes
  }

  validate (input: HttpRequest): void {
    for (const field of this.fieldSizes) {
      if (input.body[field[0]].length > field[1]) {
        throw new MaximumParamSizeError(field[0], field[1])
      }
    }
  }
}
