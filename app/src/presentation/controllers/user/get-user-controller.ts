import dateFormat from 'dateformat'
import { UserNotFoundError } from '../../../data/errors/user-not-found-error'
import { ICountPostsByAuthor } from '../../../domain/usecases/post/count-posts-by-author'
import { IGetUser } from '../../../domain/usecases/user/get-user'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { responseError, responseOk } from '../../helpers/http-response-helper'
import { BaseController } from '../../protocols/base-controller'
import { HttpRequest } from '../../protocols/http-request'
import { HttpResponse } from '../../protocols/http-response'
import { IUserResponse } from '../../protocols/responses/user-response'
export class GetUserController implements BaseController {
  private readonly getUser: IGetUser
  private readonly countPostsByAuthor: ICountPostsByAuthor

  constructor (getUser: IGetUser, countPostsByAuthor: ICountPostsByAuthor) {
    this.getUser = getUser
    this.countPostsByAuthor = countPostsByAuthor
  }

  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const userId = httRequest.params.userId
      const user = await this.getUser.get(userId)
      const countPosts = await this.countPostsByAuthor.count(user.id)

      const getUserResponse: IUserResponse = {
        id: user.id,
        username: user.username,
        countPosts: countPosts,
        createdAt: user.createdAt?.toISOString() ?? '',
        createdAtFormated: dateFormat(user.createdAt, 'mediumDate')
      }

      return responseOk(getUserResponse)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseError(new ResourceNotFoundError(error.message))
      }

      return responseError(error)
    }
  }
}
