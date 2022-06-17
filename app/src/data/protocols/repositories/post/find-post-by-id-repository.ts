import { IPostModel } from '../../../../domain/models/post-model'

export interface IFindPostByIdRepository {
  findById: (postId: string) => Promise<IPostModel | null >
}
