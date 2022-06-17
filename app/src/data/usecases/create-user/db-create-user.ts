import { IUserModel } from '../../../domain/models/user-model'
import { CreateUserModel } from '../../../domain/protocols/create-user-model'
import { ICreateUser } from '../../../domain/usecases/user/create-user'
import { ICreateUserRepository } from '../../protocols/repositories/user/create-user-repository'

export class DbCreateUser implements ICreateUser {
  private readonly userRepository: ICreateUserRepository

  constructor (userRepository: ICreateUserRepository) {
    this.userRepository = userRepository
  }

  async create (userData: CreateUserModel): Promise<IUserModel> {
    return await this.userRepository.create(userData)
  }
}
