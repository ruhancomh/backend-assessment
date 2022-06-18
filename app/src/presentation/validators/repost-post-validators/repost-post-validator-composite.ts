import { RequiredFieldsValidator } from '../required-fields-validator'
import { ValidatorComposite } from '../validator-composite'

export class RepostPostValidatorComposite extends ValidatorComposite {
  private static readonly REQUIRED_FIELDS: string[] = ['authorId']

  constructor () {
    super([
      new RequiredFieldsValidator(RepostPostValidatorComposite.REQUIRED_FIELDS)
    ])
  }
}
