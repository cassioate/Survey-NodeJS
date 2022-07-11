import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-repository'
import env from '../../../config/env'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { Authentication } from '../../../../domain/usecases/add-account/authentication'

export const makeAuthenticationFactory = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(accountMongoRepository, hashComparer, jwtAdapter, accountMongoRepository)
}
