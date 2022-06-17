import { PostTypes } from '../../../../domain/enums/post-types'
import { IPostModel } from '../../../../domain/models/post-model'
import { CreatePostModel } from '../../../../domain/protocols/create-post-model'
import { ICreatePost } from '../../../../domain/usecases/post/create-post'
import { IValidateMaxPostsDayByAuthor } from '../../../../domain/usecases/post/validate-max-posts-day-by-author'
import { IGetUser } from '../../../../domain/usecases/user/get-user'
import { MaxPostsPerDayExceededError } from '../../../errors/max-posts-per-day-exceeded-error'
import { DbCreatePostModel } from '../../../protocols/dtos/db-create-post-model'
import { ICreatePostRepository } from '../../../protocols/repositories/post/create-post-repository'

export class DbCreatePost implements ICreatePost {
  private readonly postRepository: ICreatePostRepository
  private readonly getUser: IGetUser
  private readonly validateMaxPostsDayByAuthor: IValidateMaxPostsDayByAuthor

  constructor (postRepository: ICreatePostRepository,
    getUser: IGetUser,
    validateMaxPostsDayByAuthor: IValidateMaxPostsDayByAuthor) {
    this.postRepository = postRepository
    this.getUser = getUser
    this.validateMaxPostsDayByAuthor = validateMaxPostsDayByAuthor
  }

  async create (postData: CreatePostModel): Promise<IPostModel> {
    const author = await this.getUser.get(postData.authorId)

    if (!await this.validateMaxPostsDayByAuthor.pass(author.id)) {
      throw new MaxPostsPerDayExceededError(author.id, this.validateMaxPostsDayByAuthor.getMaxPostsPerDay())
    }

    const dbPostData: DbCreatePostModel = {
      message: postData.message,
      type: PostTypes.ORIGINAL,
      authorId: author.id
    }

    return await this.postRepository.create(dbPostData)
  }
}
