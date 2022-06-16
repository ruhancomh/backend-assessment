
export class DuplicateKeyError extends Error {
  readonly code: string

  constructor (message: string) {
    super(message)
    this.code = 'DUPLICATE_KEY'
  }
}
