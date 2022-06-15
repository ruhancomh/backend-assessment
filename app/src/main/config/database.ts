import mongoose from 'mongoose'
import { env } from './env'

export const connectDb = async (): Promise<void> => {
  try {
    console.info('Trying to connect to MongoDb...')

    await mongoose.connect(env.mongo.uri, {
      dbName: env.mongo.dbName,
      autoCreate: env.mongo.autoCreate
    })

    console.info('MongoDB connected!')
  } catch (err) {
    console.error(`Failed to connect to MongoDb: ${env.mongo.uri}`, err)
    process.exit(1)
  }
}
