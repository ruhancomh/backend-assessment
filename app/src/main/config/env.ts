export const env = {
  server: {
    port: process.env.SERVER_PORT ?? 3000,
    host: process.env.SERVER_HOST ?? '0.0.0.0'
  },

  mongo: {
    uri: process.env.MONGO_URI ?? '',
    dbName: process.env.MONGO_DB_NAME ?? '',
    autoCreate: process.env.MONGO_AUTO_CREATE === 'true'
  }

}
