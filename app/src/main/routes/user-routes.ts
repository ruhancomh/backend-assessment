import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeGetUserController } from '../factories/get-user-controller-factory'

export default (router: Router): void => {
  router.get('/users/:userId', adaptRoute(makeGetUserController()))
}
