import { AccountModel } from '../../../src/domain/models/account'
import { LoadAccountByToken } from '../../../src/domain/usecases/account/load-account-by-access-token'
import { makeFakeAccount } from '../../domain/models/mocks/mock-account'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (accessToken: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenStub()
}
