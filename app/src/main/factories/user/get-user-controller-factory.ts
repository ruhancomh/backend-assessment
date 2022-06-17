import { GetUserController } from '../../../presentation/controllers/user/get-user-controller'
import { makeCountPostsByAuthorUsecase } from '../post/count-posts-by-author-usecase-factory'
import { makeGetUserUsecase } from './get-user-usecase-factory'

export const makeGetUserController = (): GetUserController => {
  return new GetUserController(makeGetUserUsecase(), makeCountPostsByAuthorUsecase())
}
