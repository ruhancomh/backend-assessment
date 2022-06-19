import { PostTypes } from '../../../../domain/enums/post-types'
import { IPostModel } from '../../../../domain/models/post-model'
import { QuotePostModel } from '../../../../domain/protocols/quote-post-model'
import { IQuotePost } from '../../../../domain/usecases/post/quote-post'
import { IValidateMaxPostsDayByAuthor } from '../../../../domain/usecases/post/validate-max-posts-day-by-author'
import { IGetUser } from '../../../../domain/usecases/user/get-user'
import { MaxPostsPerDayExceededError } from '../../../errors/max-posts-per-day-exceeded-error'
import { PostNotFoundError } from '../../../errors/post-not-found-error'
import { QuoteSelfPostError } from '../../../errors/quote-self-post-error'
import { QuotingQuoteTypeError } from '../../../errors/quoting-quote-type-error'
import { DbCreatePostModel } from '../../../protocols/dtos/db-create-post-model'
import { ICreatePostRepository } from '../../../protocols/repositories/post/create-post-repository'
import { IFindPostByIdRepository } from '../../../protocols/repositories/post/find-post-by-id-repository'

export class DbQuotePost implements IQuotePost {
  private readonly postRepository: ICreatePostRepository & IFindPostByIdRepository
  private readonly getUser: IGetUser
  private readonly validateMaxPostsDayByAuthor: IValidateMaxPostsDayByAuthor

  constructor (postRepository: ICreatePostRepository & IFindPostByIdRepository,
    getUser: IGetUser,
    validateMaxPostsDayByAuthor: IValidateMaxPostsDayByAuthor) {
    this.postRepository = postRepository
    this.getUser = getUser
    this.validateMaxPostsDayByAuthor = validateMaxPostsDayByAuthor
  }

  async quote (quoteData: QuotePostModel): Promise<IPostModel> {
    const author = await this.getUser.get(quoteData.authorId)

    if (!await this.validateMaxPostsDayByAuthor.pass(author.id)) {
      throw new MaxPostsPerDayExceededError(author.id, this.validateMaxPostsDayByAuthor.getMaxPostsPerDay())
    }

    const originalPost = await this.postRepository.findById(quoteData.orginalPostId)

    if (originalPost === null) {
      throw new PostNotFoundError(quoteData.orginalPostId)
    }

    const authorId: string = String(author.id)
    const orginalPostAuthorId: string = String(originalPost.author)

    if (this.isSameAuthor(authorId, orginalPostAuthorId)) {
      throw new QuoteSelfPostError(authorId, originalPost.id)
    }

    if (originalPost?.type === PostTypes.QUOTE) {
      throw new QuotingQuoteTypeError(originalPost.id)
    }

    const dbPostData: DbCreatePostModel = {
      message: quoteData.message,
      type: PostTypes.QUOTE,
      authorId: author.id,
      originalPostId: originalPost?.id
    }

    return await this.postRepository.create(dbPostData)
  }

  private isSameAuthor (authorId: string, originalPostId: string): boolean {
    return authorId === originalPostId
  }
}
