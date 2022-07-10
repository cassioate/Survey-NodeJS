import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-repository'
import { LogErrorRepositoryMongo } from '../../../infra/db/mongodb/log-error-repository/log-error-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidationComposite } from './login-validation-factory'
import env from '../../config/env'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, hashComparer, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(dbAuthentication, makeLoginValidationComposite())
  const logErrorRepositoryMongo = new LogErrorRepositoryMongo()
  return new LogControllerDecorator(loginController, logErrorRepositoryMongo)
}
