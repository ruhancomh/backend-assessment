import { MaxPostsPerDayExceededError } from '../../../data/errors/max-posts-per-day-exceeded-error'
import { PostNotFoundError } from '../../../data/errors/post-not-found-error'
import { QuoteSelfPostError } from '../../../data/errors/quote-self-post-error'
import { QuotingQuoteTypeError } from '../../../data/errors/quoting-quote-type-error'
import { UserNotFoundError } from '../../../data/errors/user-not-found-error'
import { QuotePostModel } from '../../../domain/protocols/quote-post-model'
import { IQuotePost } from '../../../domain/usecases/post/quote-post'
import { BadRequestError } from '../../errors/bad-request-error'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { responseCreated, responseError } from '../../helpers/http-response-helper'
import { BaseController } from '../../protocols/base-controller'
import { HttpRequest } from '../../protocols/http-request'
import { HttpResponse } from '../../protocols/http-response'
import { IPostResponse } from '../../protocols/responses/post-response'
import { Validator } from '../../protocols/validator'

export class QuotePostController implements BaseController {
  private readonly quotePost: IQuotePost
  private readonly validator: Validator

  constructor (quotePost: IQuotePost, validator: Validator) {
    this.quotePost = quotePost
    this.validator = validator
  }

  async handle (httRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validator.validate(httRequest)

      const quoteData: QuotePostModel = {
        message: httRequest.body.message,
        authorId: httRequest.body.authorId,
        orginalPostId: httRequest.params.postId
      }

      const quoteCreated = await this.quotePost.quote(quoteData)

      const repostPostResponse: IPostResponse = {
        id: quoteCreated.id,
        message: quoteCreated.message,
        type: quoteCreated.type,
        author: quoteCreated.author,
        originalPost: quoteCreated.originalPost,
        createdAt: quoteCreated.createdAt?.toISOString() ?? ''
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

      if (error instanceof QuoteSelfPostError) {
        return responseError(new BadRequestError(error.message))
      }

      if (error instanceof QuotingQuoteTypeError) {
        return responseError(new BadRequestError(error.message))
      }

      return responseError(error)
    }
  }
}
