import { PostTypes } from '../enums/post-types'

export interface IPostModel {
  id?: any
  author: any
  type: PostTypes
  message?: string
  createdAt?: Date
  originalPost?: any
}
