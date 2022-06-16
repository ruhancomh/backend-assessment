import { HttpRequest } from './http-request'

export interface Validator {
  validate: (input: HttpRequest) => void
}
