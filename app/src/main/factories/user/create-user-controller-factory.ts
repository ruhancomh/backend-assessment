import { DbCreateUser } from '../../../data/usecases/create-user/db-create-user'
import { UserMongoRepository } from '../../../infra/db/mongodb/repositories/user/user-repository'
import { CreateUserController } from '../../../presentation/controllers/user/create-user-controller'
import { CreateUserValidatorComposite } from '../../../presentation/validators/create-user-validators/create-user-validator-composite'

export const makeCreateUserController = (): CreateUserController => {
  const userRepository = new UserMongoRepository()
  const createUser = new DbCreateUser(userRepository)
  const createUserValidatorComposite = new CreateUserValidatorComposite()

  return new CreateUserController(createUser, createUserValidatorComposite)
}
