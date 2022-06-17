import { BusinessValidationError } from './business-validation-error'

export class PostNotFoundError extends BusinessValidationError {
  static code: string = 'POST_NOT_FOUND'

  constructor (postId: string) {
    const message = `Post not found for id: <${postId}>`
    super(message, PostNotFoundError.code)
  }
}
