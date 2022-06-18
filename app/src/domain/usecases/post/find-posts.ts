import { IPostModel } from '../../models/post-model'

export interface IFindPosts {
  find: (perPage?: number | null, page?: number | null, userId?: string | null, startDateString?: string | null, endDateString?: string | null) => Promise<IPostModel[]>
}
