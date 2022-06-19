import { BusinessValidationError } from './business-validation-error'

export class QuoteSelfPostError extends BusinessValidationError {
  static code: string = 'QUOTE_SELF_POST_ERROR'

  constructor (userId: string, originalPostId: string) {
    const message = `User <${userId}> are not allowed to quote self post <${originalPostId}>.`
    super(message, QuoteSelfPostError.code)
  }
}
