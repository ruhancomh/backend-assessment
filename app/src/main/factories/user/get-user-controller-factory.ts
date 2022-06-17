import { DbGetUser } from '../../../data/usecases/get-user/db-get-user'
import { UserMongoRepository } from '../../../infra/db/mongodb/repositories/user/user-repository'
import { GetUserController } from '../../../presentation/controllers/user/get-user-controller'

export const makeGetUserController = (): GetUserController => {
  const userRepository = new UserMongoRepository()
  const getUser = new DbGetUser(userRepository)

  return new GetUserController(getUser)
}
