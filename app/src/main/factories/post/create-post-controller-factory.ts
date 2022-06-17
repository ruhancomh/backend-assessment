import { DbCreatePost } from '../../../data/usecases/create-post/db-create-post'
import { PostMongoRepository } from '../../../infra/db/mongodb/repositories/post/post-repository'
import { CreatePostController } from '../../../presentation/controllers/post/create-post-controller'
import { CreatePostValidatorComposite } from '../../../presentation/validators/create-post-validators/create-post-validator-composite'

export const makeCreatePostController = (): CreatePostController => {
  const postRepository = new PostMongoRepository()
  const createPostUseCase = new DbCreatePost(postRepository)
  const createPostValidatorComposite = new CreatePostValidatorComposite()

  return new CreatePostController(createPostUseCase, createPostValidatorComposite)
}
