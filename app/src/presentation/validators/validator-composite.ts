import { HttpRequest } from '../protocols/http-request'
import { Validator } from '../protocols/validator'

export abstract class ValidatorComposite implements Validator {
  private readonly validators: Validator[]

  constructor (validators: Validator[]) {
    this.validators = validators
  }

  validate (input: HttpRequest): void {
    this.validators.forEach((validator) => validator.validate(input))
  }
}
