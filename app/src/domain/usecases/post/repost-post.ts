import { IPostModel } from '../../models/post-model'
import { RepostPostModel } from '../../protocols/repost-post-model'

export interface IRepostPost {
  repost: (repostData: RepostPostModel) => Promise<IPostModel>
}
