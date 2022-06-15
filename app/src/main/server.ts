import app from './config/app'
import { connectDb } from './config/database'
import { env } from './config/env'

connectDb()
  .then(async () => {
    app.get('/', (req, res) => {
      res.send('Hello World')
    })

    app.listen(
      env.server.port,
      env.server.host,
      () => console.log(`Server runnning at http://${env.server.host}:${env.server.port}`)
    )
  })
  .catch(error => console.error(error))
