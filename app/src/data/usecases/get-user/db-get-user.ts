import { IUserModel } from '../../../domain/models/user-model'
import { IGetUser } from '../../../domain/usecases/get-user'
import { UserNotFoundError } from '../../errors/user-not-found-error'
import { IUserRepository } from '../../protocols/repositories/user-repository'

export class DbGetUser implements IGetUser {
  private readonly userRepository: IUserRepository

  constructor (userRepository: IUserRepository) {
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
