import { DbCreatePost } from '../../../data/usecases/post/create-post/db-create-post'
import { PostMongoRepository } from '../../../infra/db/mongodb/repositories/post/post-repository'
import { CreatePostController } from '../../../presentation/controllers/post/create-post-controller'
import { CreatePostValidatorComposite } from '../../../presentation/validators/create-post-validators/create-post-validator-composite'
import { makeGetUserUsecase } from '../user/get-user-usecase-factory'

export const makeCreatePostController = (): CreatePostController => {
  const postRepository = new PostMongoRepository()
  const getUserUseCase = makeGetUserUsecase()
  const createPostUseCase = new DbCreatePost(postRepository, getUserUseCase)
  const createPostValidatorComposite = new CreatePostValidatorComposite()

  return new CreatePostController(createPostUseCase, createPostValidatorComposite)
}
