import { IUserModel } from '../../../../domain/models/user-model'

export interface IFindUserRepository {
  findById: (id: string) => Promise<IUserModel | null>
}
