import { DbCountPostsByAuthor } from '../../../data/usecases/post/count-posts-by-author/db-count-posts-by-author'
import { ICountPostsByAuthor } from '../../../domain/usecases/post/count-posts-by-author'
import { PostMongoRepository } from '../../../infra/db/mongodb/repositories/post/post-repository'

export const makeCountPostsByAuthorUsecase = (): ICountPostsByAuthor => {
  const postRepository = new PostMongoRepository()
  return new DbCountPostsByAuthor(postRepository)
}
