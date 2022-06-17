import { BusinessValidationError } from './business-validation-error'

export class MaxPostsPerDayExceededError extends BusinessValidationError {
  static code: string = 'MAX_POSTS_PER_DAY_EXCEEDED'

  constructor (userId: string, maxPostsPerDay: number) {
    const message = `User <${userId}> exceeded the max number of posts per day of <${maxPostsPerDay}>`
    super(message, MaxPostsPerDayExceededError.code)
  }
}
