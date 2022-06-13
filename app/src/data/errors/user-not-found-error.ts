import { BusinessValidationError } from './business-validation-error'

export class UserNotFoundError extends BusinessValidationError {
  static code: string = 'USER_NOT_FOUND'

  constructor (userId: string) {
    const message = 'User not found for id: ' + userId
    super(message, UserNotFoundError.code)
  }
}
