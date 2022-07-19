import { AuthMiddleware } from '../../../../presentation/middlewares/auth/auth-middleware'
import { Middleware } from '../../../../presentation/protocols/middleware'
import { makeDbLoadAccountByToken } from '../../usecases/account/load-account-by-token-uscase-facoty'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const middleware = new AuthMiddleware(
    makeDbLoadAccountByToken(),
    role
  )
  return middleware
}
