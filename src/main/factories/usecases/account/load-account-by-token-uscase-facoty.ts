import { DbLoadAccountByToken } from '../../../../data/usecases/account/db-load-account-by-access-token'
import { LoadAccountByToken } from '../../../../domain/usecases/account/load-account-by-access-token'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-repository'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
