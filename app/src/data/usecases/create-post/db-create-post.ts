import { PostTypes } from '../../../domain/enums/post-types'
import { IPostModel } from '../../../domain/models/post-model'
import { CreatePostModel } from '../../../domain/protocols/create-post-model'
import { ICreatePost } from '../../../domain/usecases/post/create-post'
import { IGetUser } from '../../../domain/usecases/user/get-user'
import { DbCreatePostModel } from '../../protocols/dtos/db-create-post-model'
import { ICreatePostRepository } from '../../protocols/repositories/post/create-post-repository'

export class DbCreatePost implements ICreatePost {
  private readonly postRepository: ICreatePostRepository
  private readonly getUser: IGetUser

  constructor (postRepository: ICreatePostRepository, getUser: IGetUser) {
    this.postRepository = postRepository
    this.getUser = getUser
  }

  async create (postData: CreatePostModel): Promise<IPostModel> {
    const author = await this.getUser.get(postData.authorId)

    const dbPostData: DbCreatePostModel = {
      message: postData.message,
      type: PostTypes.ORIGINAL,
      authorId: author.id
    }

    return await this.postRepository.create(dbPostData)
  }
}
