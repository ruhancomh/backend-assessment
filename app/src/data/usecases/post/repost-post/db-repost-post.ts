import { PostTypes } from '../../../../domain/enums/post-types'
import { IPostModel } from '../../../../domain/models/post-model'
import { RepostPostModel } from '../../../../domain/protocols/repost-post-model'
import { IRepostPost } from '../../../../domain/usecases/post/repost-post'
import { IValidateMaxPostsDayByAuthor } from '../../../../domain/usecases/post/validate-max-posts-day-by-author'
import { IGetUser } from '../../../../domain/usecases/user/get-user'
import { MaxPostsPerDayExceededError } from '../../../errors/max-posts-per-day-exceeded-error'
import { PostNotFoundError } from '../../../errors/post-not-found-error'
import { RepostingRepostTypeError } from '../../../errors/reposting-repost-type-error'
import { RepostingSelfPostError } from '../../../errors/reposting-self-post-error'
import { DbCreatePostModel } from '../../../protocols/dtos/db-create-post-model'
import { ICreatePostRepository } from '../../../protocols/repositories/post/create-post-repository'
import { IFindPostByIdRepository } from '../../../protocols/repositories/post/find-post-by-id-repository'

export class DbRepostPost implements IRepostPost {
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

  async repost (postData: RepostPostModel): Promise<IPostModel> {
    const author = await this.getUser.get(postData.authorId)

    if (!await this.validateMaxPostsDayByAuthor.pass(author.id)) {
      throw new MaxPostsPerDayExceededError(author.id, this.validateMaxPostsDayByAuthor.getMaxPostsPerDay())
    }

    const originalPost = await this.postRepository.findById(postData.orginalPostId)

    if (originalPost === null) {
      throw new PostNotFoundError(postData.orginalPostId)
    }

    const authorId: string = String(author.id)
    const orginalPostAuthorId: string = String(originalPost.author)

    if (this.isSameAuthor(authorId, orginalPostAuthorId)) {
      throw new RepostingSelfPostError(authorId, originalPost.id)
    }

    if (originalPost?.type === PostTypes.REPOST) {
      throw new RepostingRepostTypeError(originalPost.id)
    }

    const dbPostData: DbCreatePostModel = {
      type: PostTypes.REPOST,
      authorId: author.id,
      originalPostId: originalPost?.id
    }

    return await this.postRepository.create(dbPostData)
  }

  private isSameAuthor (authorId: string, originalPostId: string): boolean {
    return authorId === originalPostId
  }
}
