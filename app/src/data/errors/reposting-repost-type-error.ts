import { BusinessValidationError } from './business-validation-error'

export class RepostingRepostTypeError extends BusinessValidationError {
  static code: string = 'REPOSTING_REPOST_TYPE_ERROR'

  constructor (originalPostId: string) {
    const message = `User can not repost the post <${originalPostId}> of type <repost>.`
    super(message, RepostingRepostTypeError.code)
  }
}
