import { DbRepostPost } from '../../../data/usecases/post/repost-post/db-repost-post'
import { PostMongoRepository } from '../../../infra/db/mongodb/repositories/post/post-repository'
import { RepostPostController } from '../../../presentation/controllers/post/repost-post-controller'
import { RepostPostValidatorComposite } from '../../../presentation/validators/repost-post-validators/repost-post-validator-composite'
import { makeGetUserUsecase } from '../user/get-user-usecase-factory'
import { makeValidateMaxPostsDayByAuthorUseCase } from './validate-max-posts-day-by-author-usecase-factory'

export const makeRepostPostController = (): RepostPostController => {
  const postRepository = new PostMongoRepository()
  const getUserUseCase = makeGetUserUsecase()
  const validateMaxPostsDayByAuthor = makeValidateMaxPostsDayByAuthorUseCase()
  const repostPostUseCase = new DbRepostPost(postRepository, getUserUseCase, validateMaxPostsDayByAuthor)
  const createRepostValidatorComposite = new RepostPostValidatorComposite()

  return new RepostPostController(repostPostUseCase, createRepostValidatorComposite)
}
