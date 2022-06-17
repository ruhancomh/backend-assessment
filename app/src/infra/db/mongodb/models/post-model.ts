import mongoose, { Document, Model, Schema } from 'mongoose'
import { PostTypes } from '../../../../domain/enums/post-types'
import { IPostModel } from '../../../../domain/models/post-model'

export interface IPostMongoModel extends Document, IPostModel { }

const postSchema = new Schema({
  message: {
    type: String
  },
  type: {
    type: String,
    enum: Object.values(PostTypes),
    default: PostTypes.ORIGINAL,
    required: true
  }
},
{
  timestamps: true
})

export const PostMongoModel: Model<IPostMongoModel> = mongoose.model('Post', postSchema)
