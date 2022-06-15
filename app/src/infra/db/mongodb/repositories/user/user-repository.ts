import { IUserRepository } from '../../../../../data/protocols/repositories/user-repository'
import { IUserModel } from '../../../../../domain/models/user-model'
import { UserMongoModel } from '../../models/user-model'

export class UserMongoRepository implements IUserRepository {
  async findById (id: string): Promise<IUserModel | null> {
    return await UserMongoModel.findById(id)
  }
}
