import { BadRequestError } from '../errors/bad-request-error'
import { InternalServerError } from '../errors/internal-server-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ApiError } from '../protocols/api-error'
import { HttpResponse } from '../protocols/http-response'

export const responseError = (error: ApiError): HttpResponse => {
  let handledError = error

  if (!(error instanceof BadRequestError) &&
      !(error instanceof ResourceNotFoundError)) {
    handledError = new InternalServerError()
  }

  return {
    statusCode: handledError.statusCode,
    body: handledError
  }
}

export const responseOk = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data
  }
}
