import { RequiredFieldsValidator } from '../required-fields-validator'
import { ValidatorComposite } from '../validator-composite'

export class CreateUserValidatorComposite extends ValidatorComposite {
  private static readonly REQUIRED_FIELDS: string[] = ['username']

  constructor () {
    super([
      new RequiredFieldsValidator(CreateUserValidatorComposite.REQUIRED_FIELDS)
    ])
  }
}
