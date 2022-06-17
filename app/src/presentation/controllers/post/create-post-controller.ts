import { CreatePostModel } from '../../../domain/protocols/create-post-model'
import { ICreatePost } from '../../../domain/usecases/post/create-post'
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
        message: httRequest.body.message
      }

      const postCreated = await this.createPost.create(createPostData)

      const createPostResponse: IPostResponse = {
        id: postCreated.id,
        type: postCreated.type,
        message: postCreated.message,
        createdAt: postCreated.createdAt?.toISOString() ?? ''
      }

      return responseCreated(createPostResponse)
    } catch (error) {
      return responseError(error)
    }
  }
}
