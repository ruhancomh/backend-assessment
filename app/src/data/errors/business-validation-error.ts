export class BusinessValidationError extends Error {
  readonly code: string

  constructor (message: string, code: string) {
    super(message)
    this.code = code
  }
}
