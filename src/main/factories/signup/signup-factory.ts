
import { LogErrorRepositoryMongo } from '../../../infra/db/mongodb/log-error-repository/log-error-repository'
import { Controller } from '../../../presentation/protocols'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidationComposite } from './signup-validation-factory'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import env from '../../config/env'

export const makeSignUpController = (): Controller => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const bcryptAdapter = new BcryptAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidationComposite(), dbAuthentication)
  const logErrorRepositoryMongo = new LogErrorRepositoryMongo()
  return new LogControllerDecorator(signUpController, logErrorRepositoryMongo)
}
