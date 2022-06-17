import { DbCreatePost } from '../../../data/usecases/create-post/db-create-post'
import { PostMongoRepository } from '../../../infra/db/mongodb/repositories/post/post-repository'
import { CreatePostController } from '../../../presentation/controllers/post/create-post-controller'

export const makeCreatePostController = (): CreatePostController => {
  const postRepository = new PostMongoRepository()
  const createPostUseCase = new DbCreatePost(postRepository)

  return new CreatePostController(createPostUseCase)
}
