import { FieldSizeValidator } from '../field-size-validator'
import { RequiredFieldsValidator } from '../required-fields-validator'
import { StringAlphanumericValidator } from '../string-alphanumeric-validator'
import { ValidatorComposite } from '../validator-composite'

export class CreateUserValidatorComposite extends ValidatorComposite {
  private static readonly REQUIRED_FIELDS: string[] = ['username']
  private static readonly ALPHANUMERIC_FIELDS: string[] = ['username']
  private static readonly FIELD_SIZES: Map<string, number> = new Map<string, number>([
    ['username', 14]
  ])

  constructor () {
    super([
      new RequiredFieldsValidator(CreateUserValidatorComposite.REQUIRED_FIELDS),
      new FieldSizeValidator(CreateUserValidatorComposite.FIELD_SIZES),
      new StringAlphanumericValidator(CreateUserValidatorComposite.ALPHANUMERIC_FIELDS)
    ])
  }
}
