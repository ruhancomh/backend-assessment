import { ICreateUser } from '../../../domain/usecases/user/create-user'
import { DuplicateKeyError } from '../../../infra/errors/duplicate-key-error'
import { BadRequestError } from '../../errors/bad-request-error'
import { responseCreated, responseError } from '../../helpers/http-response-helper'
import { BaseController } from '../../protocols/base-controller'
import { HttpRequest } from '../../protocols/http-request'
import { HttpResponse } from '../../protocols/http-response'
import { IUserResponse } from '../../protocols/responses/user-response'
import { Validator } from '../../protocols/validator'

export class CreateUserController implements BaseController {
  private readonly createUser: ICreateUser
  private readonly validator: Validator

  constructor (createUser: ICreateUser, validator: Validator) {
    this.createUser = createUser
    this.validator = validator
  }

  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(httRequest)

      const username = httRequest.body.username

      const userCreated = await this.createUser.create({
        username: username
      })

      const userResponse: IUserResponse = {
        id: userCreated.id,
        username: userCreated.username,
        createdAt: userCreated.createdAt?.toISOString() ?? ''
      }

      return responseCreated(userResponse)
    } catch (error) {
      if (error instanceof DuplicateKeyError) {
        return responseError(new BadRequestError(error.message))
      }

      return responseError(error)
    }
  }
}
