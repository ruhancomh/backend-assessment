import { PostTypes } from '../../../domain/enums/post-types'

export interface DbCreatePostModel {
  message: string
  type: PostTypes
  authorId: string
}
