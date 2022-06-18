import { MaxPostsPerDayExceededError } from '../../../data/errors/max-posts-per-day-exceeded-error'
import { UserNotFoundError } from '../../../data/errors/user-not-found-error'
import { IRepostPost } from '../../../domain/usecases/post/repost-post'
import { BadRequestError } from '../../errors/bad-request-error'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { responseCreated, responseError } from '../../helpers/http-response-helper'
import { BaseController } from '../../protocols/base-controller'
import { HttpRequest } from '../../protocols/http-request'
import { HttpResponse } from '../../protocols/http-response'
import { Validator } from '../../protocols/validator'
import { RepostPostModel } from '../../../domain/protocols/repost-post-model'
import { IPostResponse } from '../../protocols/responses/post-response'
import { PostNotFoundError } from '../../../data/errors/post-not-found-error'
import { RepostingSelfPostError } from '../../../data/errors/reposting-self-post-error'
import { RepostingRepostTypeError } from '../../../data/errors/reposting-repost-type-error'

export class RepostPostController implements BaseController {
  private readonly repostPost: IRepostPost
  private readonly validator: Validator

  constructor (repostPost: IRepostPost, validator: Validator) {
    this.repostPost = repostPost
    this.validator = validator
  }

  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(httRequest)

      const repostData: RepostPostModel = {
        authorId: httRequest.body.authorId,
        orginalPostId: httRequest.params.postId
      }

      const repostCreated = await this.repostPost.repost(repostData)

      const repostPostResponse: IPostResponse = {
        id: repostCreated.id,
        type: repostCreated.type,
        author: repostCreated.author,
        originalPost: repostCreated.originalPost,
        createdAt: repostCreated.createdAt?.toISOString() ?? ''
      }

      return responseCreated(repostPostResponse)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseError(new ResourceNotFoundError(error.message))
      }

      if (error instanceof PostNotFoundError) {
        return responseError(new ResourceNotFoundError(error.message))
      }

      if (error instanceof MaxPostsPerDayExceededError) {
        return responseError(new BadRequestError(error.message))
      }

      if (error instanceof RepostingSelfPostError) {
        return responseError(new BadRequestError(error.message))
      }

      if (error instanceof RepostingRepostTypeError) {
        return responseError(new BadRequestError(error.message))
      }

      return responseError(error)
    }
  }
}
