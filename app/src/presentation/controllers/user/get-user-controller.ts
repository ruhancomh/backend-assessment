import { UserNotFoundError } from '../../../data/errors/user-not-found-error'
import { IGetUser } from '../../../domain/usecases/get-user'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { responseError, responseOk } from '../../helpers/http-response-helper'
import { BaseController } from '../../protocols/base-controller'
import { HttpRequest } from '../../protocols/http-request'
import { HttpResponse } from '../../protocols/http-response'

export class GetUserController implements BaseController {
  private readonly getUser: IGetUser

  constructor (getUser: IGetUser) {
    this.getUser = getUser
  }

  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const userId = httRequest.params.userId
      const user = await this.getUser.get(userId)

      return responseOk(user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseError(new ResourceNotFoundError(error.message))
      }

      return responseError(error)
    }
  }
}
