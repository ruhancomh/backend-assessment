import { IUserModel } from '../../../../domain/models/user-model'
import { IGetUser } from '../../../../domain/usecases/user/get-user'
import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { IFindUserRepository } from '../../../protocols/repositories/user/find-user-repository'

export class DbGetUser implements IGetUser {
  private readonly userRepository: IFindUserRepository

  constructor (userRepository: IFindUserRepository) {
    this.userRepository = userRepository
  }

  async get (id: string): Promise<IUserModel> {
    const user = await this.userRepository.findById(id)

    if (user === null) {
      throw new UserNotFoundError(id)
    }

    return user
  }
}
