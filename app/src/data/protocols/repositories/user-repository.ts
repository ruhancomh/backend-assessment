import { IUserModel } from '../../../domain/models/user-model'

export interface IUserRepository {
  findById: (id: string) => Promise<IUserModel | null>
}
