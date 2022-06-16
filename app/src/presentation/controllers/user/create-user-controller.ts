import { ICreateUser } from '../../../domain/usecases/create-user'
import { DuplicateKeyError } from '../../../infra/errors/duplicate-key-error'
import { BadRequestError } from '../../errors/bad-request-error'
import { responseCreated, responseError } from '../../helpers/http-response-helper'
import { BaseController } from '../../protocols/base-controller'
import { HttpRequest } from '../../protocols/http-request'
import { HttpResponse } from '../../protocols/http-response'

export class CreateUserController implements BaseController {
  private readonly createUser: ICreateUser

  constructor (createUser: ICreateUser) {
    this.createUser = createUser
  }

  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const username = httRequest.body.username

      const userCreated = await this.createUser.create({
        username: username
      })

      return responseCreated(userCreated)
    } catch (error) {
      if (error instanceof DuplicateKeyError) {
        return responseError(new BadRequestError(error.message))
      }

      return responseError(error)
    }
  }
}
