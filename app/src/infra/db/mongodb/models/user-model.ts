import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUserModel } from '../../../../domain/models/user-model'

export interface IUserMongoModel extends Document, IUserModel { }

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  }
},
{
  timestamps: true
})

export const UserMongoModel: Model<IUserMongoModel> = mongoose.model('User', userSchema)
