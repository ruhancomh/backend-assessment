import { MissingParamError } from '../errors/missing-param-error'
import { HttpRequest } from '../protocols/http-request'
import { Validator } from '../protocols/validator'

export class RequiredFieldsValidator implements Validator {
  protected readonly requiredFields: string[]

  constructor (requiredFields: string[]) {
    this.requiredFields = requiredFields
  }

  validate (input: HttpRequest): void {
    this.requiredFields.forEach((requiredField): void => {
      if (input.body[requiredField] === undefined) {
        throw new MissingParamError(requiredField)
      }
    })
  }
}
