import { IFindUserRepository } from '../../../../../data/protocols/repositories/find-user-repository'
import { IUserModel } from '../../../../../domain/models/user-model'
import { UserMongoModel } from '../../models/user-model'

export class UserMongoRepository implements IFindUserRepository {
  async findById (id: string): Promise<IUserModel | null> {
    return await UserMongoModel.findById(id)
  }
}
