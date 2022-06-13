import { IUserModel } from '../models/user-model'

export interface GetUser {
  get: (id: string) => Promise<IUserModel>
}
