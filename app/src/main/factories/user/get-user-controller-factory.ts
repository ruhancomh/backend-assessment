import { GetUserController } from '../../../presentation/controllers/user/get-user-controller'
import { makeGetUserUsecase } from './get-user-usecase-factory'

export const makeGetUserController = (): GetUserController => {
  return new GetUserController(makeGetUserUsecase())
}
