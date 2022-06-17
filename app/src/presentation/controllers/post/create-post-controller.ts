import { CreatePostModel } from '../../../domain/protocols/create-post-model'
import { ICreatePost } from '../../../domain/usecases/post/create-post'
import { responseCreated, responseError } from '../../helpers/http-response-helper'
import { BaseController } from '../../protocols/base-controller'
import { HttpRequest } from '../../protocols/http-request'
import { HttpResponse } from '../../protocols/http-response'

export class CreatePostController implements BaseController {
  private readonly createPost: ICreatePost

  constructor (createPost: ICreatePost) {
    this.createPost = createPost
  }

  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const createPostData: CreatePostModel = {
        message: httRequest.body.message
      }

      const postCreated = await this.createPost.create(createPostData)

      return responseCreated(postCreated)
    } catch (error) {
      return responseError(error)
    }
  }
}
