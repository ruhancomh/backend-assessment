import { DbFindPosts } from '../../../data/usecases/post/find-posts/db-find-posts'
import { PostMongoRepository } from '../../../infra/db/mongodb/repositories/post/post-repository'
import { FindPostsController } from '../../../presentation/controllers/post/find-posts-controller'

export const makeFindPostsController = (): FindPostsController => {
  const postRepository = new PostMongoRepository()
  const getPostsUseCase = new DbFindPosts(postRepository)

  return new FindPostsController(getPostsUseCase)
}
