import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/api/login', adaptRoute(makeLoginController()))
}
