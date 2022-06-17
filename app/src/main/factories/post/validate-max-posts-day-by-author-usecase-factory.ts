import { DbValidateMaxPostsDayByAuthor } from '../../../data/usecases/post/validate-max-posts-day-by-author/db-validate-max-posts-day-by-author'
import { IValidateMaxPostsDayByAuthor } from '../../../domain/usecases/post/validate-max-posts-day-by-author'
import { PostMongoRepository } from '../../../infra/db/mongodb/repositories/post/post-repository'

export const makeValidateMaxPostsDayByAuthorUseCase = (): IValidateMaxPostsDayByAuthor => {
  const postRepository = new PostMongoRepository()
  return new DbValidateMaxPostsDayByAuthor(postRepository)
}
