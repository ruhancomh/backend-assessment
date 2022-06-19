import { DbQuotePost } from '../../../data/usecases/post/quote-post/db-quote-post'
import { PostMongoRepository } from '../../../infra/db/mongodb/repositories/post/post-repository'
import { QuotePostController } from '../../../presentation/controllers/post/quote-post-controller'
import { QuotePostValidatorComposite } from '../../../presentation/validators/quote-post-validators/repost-post-validator-composite'
import { makeGetUserUsecase } from '../user/get-user-usecase-factory'
import { makeValidateMaxPostsDayByAuthorUseCase } from './validate-max-posts-day-by-author-usecase-factory'

export const makeQuotePostController = (): QuotePostController => {
  const postRepository = new PostMongoRepository()
  const getUserUseCase = makeGetUserUsecase()
  const validateMaxPostsDayByAuthor = makeValidateMaxPostsDayByAuthorUseCase()
  const repostPostUseCase = new DbQuotePost(postRepository, getUserUseCase, validateMaxPostsDayByAuthor)
  const createQuoteValidatorComposite = new QuotePostValidatorComposite()

  return new QuotePostController(repostPostUseCase, createQuoteValidatorComposite)
}
