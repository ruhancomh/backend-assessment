import { FieldSizeValidator } from '../field-size-validator'
import { RequiredFieldsValidator } from '../required-fields-validator'
import { ValidatorComposite } from '../validator-composite'

export class CreatePostValidatorComposite extends ValidatorComposite {
  private static readonly FIELD_SIZES: Map<string, number> = new Map<string, number>([
    ['message', 777]
  ])

  private static readonly REQUIRED_FIELDS: string[] = ['message']

  constructor () {
    super([
      new RequiredFieldsValidator(CreatePostValidatorComposite.REQUIRED_FIELDS),
      new FieldSizeValidator(CreatePostValidatorComposite.FIELD_SIZES)
    ])
  }
}
