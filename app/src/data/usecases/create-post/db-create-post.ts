import { PostTypes } from '../../../domain/enums/post-types'
import { IPostModel } from '../../../domain/models/post-model'
import { CreatePostModel } from '../../../domain/protocols/create-post-model'
import { ICreatePost } from '../../../domain/usecases/post/create-post'
import { DbCreatePostModel } from '../../protocols/dtos/db-create-post-model'
import { ICreatePostRepository } from '../../protocols/repositories/post/create-post-repository'

export class DbCreatePost implements ICreatePost {
  private readonly postRepository: ICreatePostRepository

  constructor (postRepository: ICreatePostRepository) {
    this.postRepository = postRepository
  }

  async create (postData: CreatePostModel): Promise<IPostModel> {
    const dbPostData: DbCreatePostModel = {
      message: postData.message,
      type: PostTypes.ORIGINAL
    }

    return await this.postRepository.create(dbPostData)
  }
}
