import { BusinessValidationError } from './business-validation-error'

export class RepostingSelfPostError extends BusinessValidationError {
  static code: string = 'REPOSTING_SELF_POST_ERROR'

  constructor (userId: string, originalPostId: string) {
    const message = `User <${userId}> are not allowed to repost self post <${originalPostId}>.`
    super(message, RepostingSelfPostError.code)
  }
}
