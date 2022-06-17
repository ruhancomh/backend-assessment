import { IPostModel } from '../models/post-model'
import { CreatePostModel } from '../protocols/create-post-model'

export interface ICreatePost {
  create: (createPost: CreatePostModel) => Promise<IPostModel>
}
