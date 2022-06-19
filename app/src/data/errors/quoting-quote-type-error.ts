import { BusinessValidationError } from './business-validation-error'

export class QuotingQuoteTypeError extends BusinessValidationError {
  static code: string = 'QUOTING_QUOTE_TYPE_ERROR'

  constructor (originalPostId: string) {
    const message = `User can not quote the post <${originalPostId}> of type <quote>.`
    super(message, QuotingQuoteTypeError.code)
  }
}
