import { PostTypes } from '../enums/post-types'

export interface IPostModel {
  id?: any
  type: PostTypes
  message: string
  createdAt?: Date
  originalPost?: IPostModel
}
