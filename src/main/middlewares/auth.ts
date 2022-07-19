import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth/auth-middleware-factory'

export const auth = (role?: string): any => {
  return adaptMiddleware(makeAuthMiddleware(role))
}
