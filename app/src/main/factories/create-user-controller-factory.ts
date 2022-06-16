import { DbCreateUser } from '../../data/usecases/create-user/db-create-user'
import { UserMongoRepository } from '../../infra/db/mongodb/repositories/user/user-repository'
import { CreateUserController } from '../../presentation/controllers/user/create-user-controller'

export const makeCreateUserController = (): CreateUserController => {
  const userRepository = new UserMongoRepository()
  const createUser = new DbCreateUser(userRepository)

  return new CreateUserController(createUser)
}
