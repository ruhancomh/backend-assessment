import { DbCreatePostModel } from '../../../../../data/protocols/dtos/db-create-post-model'
import { ICountPostsByAuthorInDateRangeRepository } from '../../../../../data/protocols/repositories/post/count-posts-by-author-in-date-range-repository'
import { ICountPostsByAuthorRepository } from '../../../../../data/protocols/repositories/post/count-posts-by-author-repository'
import { ICreatePostRepository } from '../../../../../data/protocols/repositories/post/create-post-repository'
import { IFindPostByIdRepository } from '../../../../../data/protocols/repositories/post/find-post-by-id-repository'
import { IPostModel } from '../../../../../domain/models/post-model'
import { PostMongoModel } from '../../models/post-model'

export class PostMongoRepository
implements ICreatePostRepository, ICountPostsByAuthorRepository, ICountPostsByAuthorInDateRangeRepository,
IFindPostByIdRepository {
  async findById (postId: string): Promise<IPostModel | null> {
    return await PostMongoModel.findById(postId)
  }

  async countByAuthorInDateRange (authorId: string, startDate: Date, endDate: Date): Promise<number> {
    return await PostMongoModel.countDocuments({
      author: authorId,
      createdAt: {
        $gte: startDate,
        $lt: endDate
      }
    })
  }

  async countByAuthor (authorId: string): Promise<number> {
    return await PostMongoModel.countDocuments({ author: authorId })
  }

  async create (postData: DbCreatePostModel): Promise<IPostModel> {
    const postModel = new PostMongoModel()

    postModel.message = postData.message
    postModel.type = postData.type
    postModel.author = postData.authorId

    return await postModel.save()
  }
}
