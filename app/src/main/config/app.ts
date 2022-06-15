import { setupMiddlewares } from './middlewares'
import express from 'express'
import { setupRouts } from './routs'

const app = express()
setupMiddlewares(app)
setupRouts(app)

export default app
