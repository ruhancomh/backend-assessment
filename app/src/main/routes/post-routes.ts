import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreatePostController } from '../factories/post/create-post-controller-factory'

export default (router: Router): void => {
  router.post('/posts/', adaptRoute(makeCreatePostController()))
}
