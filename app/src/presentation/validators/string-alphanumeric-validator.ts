import { RequiredAlphanumericParamError } from '../errors/required-alphanumeric-param-error'
import { HttpRequest } from '../protocols/http-request'
import { Validator } from '../protocols/validator'

export class StringAlphanumericValidator implements Validator {
  protected readonly regExp = '^([a-zA-Z0-9]+)$'
  protected readonly fieldToValidate: string[]

  constructor (fieldToValidate: string[]) {
    this.fieldToValidate = fieldToValidate
  }

  validate (input: HttpRequest): void {
    const pattern = new RegExp(this.regExp)

    for (const field of this.fieldToValidate) {
      if (!pattern.test(input.body[field])) {
        throw new RequiredAlphanumericParamError(field)
      }
    }
  }
}
