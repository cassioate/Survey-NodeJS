import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/signup-factory'

export default (router: Router): void => {
  router.post('/api/signup', adaptRoute(makeSignUpController()))
}
