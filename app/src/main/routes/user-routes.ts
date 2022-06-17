import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreateUserController } from '../factories/user/create-user-controller-factory'
import { makeGetUserController } from '../factories/user/get-user-controller-factory'

export default (router: Router): void => {
  router.get('/users/:userId', adaptRoute(makeGetUserController()))

  router.post('/users/', adaptRoute(makeCreateUserController()))
}
