import { FieldSizeValidator } from '../field-size-validator'
import { RequiredFieldsValidator } from '../required-fields-validator'
import { ValidatorComposite } from '../validator-composite'

export class QuotePostValidatorComposite extends ValidatorComposite {
  private static readonly REQUIRED_FIELDS: string[] = ['authorId', 'message']
  private static readonly FIELD_SIZES: Map<string, number> = new Map<string, number>([
    ['message', 777]
  ])

  constructor () {
    super([
      new RequiredFieldsValidator(QuotePostValidatorComposite.REQUIRED_FIELDS),
      new FieldSizeValidator(QuotePostValidatorComposite.FIELD_SIZES)
    ])
  }
}
