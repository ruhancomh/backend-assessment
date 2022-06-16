import { IUserModel } from '../models/user-model'
import { CreateUserModel } from '../protocols/create-user-model'

export interface ICreateUser {
  create: (createUser: CreateUserModel) => Promise<IUserModel>
}
