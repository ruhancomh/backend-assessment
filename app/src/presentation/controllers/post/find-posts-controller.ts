import { IFindPosts } from '../../../domain/usecases/post/find-posts'
import { responseError, responseOk } from '../../helpers/http-response-helper'
import { BaseController } from '../../protocols/base-controller'
import { HttpRequest } from '../../protocols/http-request'
import { HttpResponse } from '../../protocols/http-response'

export class FindPostsController implements BaseController {
  private readonly getPosts: IFindPosts

  constructor (getPosts: IFindPosts) {
    this.getPosts = getPosts
  }

  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { page, perPage, userId, startDate, endDate } = httRequest.query
      const posts = await this.getPosts.find(perPage, page, userId, startDate, endDate)

      return responseOk(posts)
    } catch (error) {
      return responseError(error)
    }
  }
}
