import { IUserModel } from '../models/user-model'

export interface IGetUser {
  get: (id: string) => Promise<IUserModel>
}
