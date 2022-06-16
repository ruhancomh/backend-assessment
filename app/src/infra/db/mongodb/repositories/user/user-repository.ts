import { ICreateUserRepository } from '../../../../../data/protocols/repositories/create-user-repository'
import { IFindUserRepository } from '../../../../../data/protocols/repositories/find-user-repository'
import { IUserModel } from '../../../../../domain/models/user-model'
import { CreateUserModel } from '../../../../../domain/protocols/create-user-model'
import { DuplicateKeyError } from '../../../../errors/duplicate-key-error'
import { UserMongoModel } from '../../models/user-model'

export class UserMongoRepository implements IFindUserRepository, ICreateUserRepository {
  async findById (id: string): Promise<IUserModel | null> {
    return await UserMongoModel.findById(id)
  }

  async create (userData: CreateUserModel): Promise<IUserModel> {
    try {
      const userModel = new UserMongoModel()
      userModel.username = userData.username

      return await userModel.save()
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        throw new DuplicateKeyError(error.message)
      }

      throw error
    }
  }
}
