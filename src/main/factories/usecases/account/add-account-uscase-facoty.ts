
import { DbAddAccount } from '../../../../data/usecases/account/db-add-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-repository'
import { AddAccount } from '../../../../domain/usecases/account/add-account'

export const makeDbAddAccountFactory = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
