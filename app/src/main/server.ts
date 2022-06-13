import app from './config/app'
import { env } from './config/env'

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(
  env.serverPort,
  env.serverHost,
  () => console.log(`Server runnning at http://localhost:${env.serverPort}`)
)
