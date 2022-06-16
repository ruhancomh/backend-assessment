import { IUserModel } from '../../../domain/models/user-model'
import { CreateUserModel } from '../../../domain/protocols/create-user-model'

export interface ICreateUserRepository {
  create: (userData: CreateUserModel) => Promise<IUserModel>
}
