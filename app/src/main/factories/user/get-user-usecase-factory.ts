import { DbGetUser } from '../../../data/usecases/user/get-user/db-get-user'
import { IGetUser } from '../../../domain/usecases/user/get-user'
import { UserMongoRepository } from '../../../infra/db/mongodb/repositories/user/user-repository'

export const makeGetUserUsecase = (): IGetUser => {
  const userRepository = new UserMongoRepository()
  return new DbGetUser(userRepository)
}
