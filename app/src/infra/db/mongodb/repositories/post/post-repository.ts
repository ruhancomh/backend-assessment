import { DbCreatePostModel } from '../../../../../data/protocols/dtos/db-create-post-model'
import { ICreatePostRepository } from '../../../../../data/protocols/repositories/post/create-post-repository'
import { IPostModel } from '../../../../../domain/models/post-model'
import { PostMongoModel } from '../../models/post-model'

export class PostMongoRepository implements ICreatePostRepository {
  async create (postData: DbCreatePostModel): Promise<IPostModel> {
    const postModel = new PostMongoModel()

    postModel.message = postData.message
    postModel.type = postData.type

    return await postModel.save()
  }
}
