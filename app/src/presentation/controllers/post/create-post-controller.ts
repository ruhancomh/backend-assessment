import { MaxPostsPerDayExceededError } from '../../../data/errors/max-posts-per-day-exceeded-error'
import { UserNotFoundError } from '../../../data/errors/user-not-found-error'
import { CreatePostModel } from '../../../domain/protocols/create-post-model'
import { ICreatePost } from '../../../domain/usecases/post/create-post'
import { BadRequestError } from '../../errors/bad-request-error'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { responseCreated, responseError } from '../../helpers/http-response-helper'
import { BaseController } from '../../protocols/base-controller'
import { HttpRequest } from '../../protocols/http-request'
import { HttpResponse } from '../../protocols/http-response'
import { IPostResponse } from '../../protocols/responses/post-response'
import { Validator } from '../../protocols/validator'

export class CreatePostController implements BaseController {
  private readonly createPost: ICreatePost
  private readonly validator: Validator

  constructor (createPost: ICreatePost, validator: Validator) {
    this.createPost = createPost
    this.validator = validator
  }

  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(httRequest)

      const createPostData: CreatePostModel = {
        message: httRequest.body.message,
        authorId: httRequest.body.authorId
      }

      const postCreated = await this.createPost.create(createPostData)

      const createPostResponse: IPostResponse = {
        id: postCreated.id,
        type: postCreated.type,
        message: postCreated.message,
        author: postCreated.author,
        createdAt: postCreated.createdAt?.toISOString() ?? ''
      }

      return responseCreated(createPostResponse)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseError(new ResourceNotFoundError(error.message))
      }

      if (error instanceof MaxPostsPerDayExceededError) {
        return responseError(new BadRequestError(error.message))
      }

      return responseError(error)
    }
  }
}
