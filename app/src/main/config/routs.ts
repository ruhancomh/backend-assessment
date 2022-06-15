import { Express, Router } from 'express'
import fg from 'fast-glob'

export const setupRouts = (app: Express): void => {
  const router = Router()

  app.use('/api/v1', router)

  fg.sync('**/src/main/routes/**routes.ts')
    .map(async file => {
      (await import(`../../../${file}`)).default(router)
    })
}
