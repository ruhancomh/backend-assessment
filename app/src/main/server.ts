// import express from 'express'

// const PORT = 3000
// const HOST = '0.0.0.0'

// const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello World')
// })

// app.listen(PORT, HOST)

import app from './config/app'
import { env } from './config/env'

app.listen(
  env.serverPort,
  env.serverHost,
  () => console.log(`Server runnning at http://localhost:${env.serverPort}`)
)
