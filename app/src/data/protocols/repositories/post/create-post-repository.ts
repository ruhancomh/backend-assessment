import { IPostModel } from '../../../../domain/models/post-model'
import { DbCreatePostModel } from '../../dtos/db-create-post-model'

export interface ICreatePostRepository {
  create: (postData: DbCreatePostModel) => Promise<IPostModel>
}
