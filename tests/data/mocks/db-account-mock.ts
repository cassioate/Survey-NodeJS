import { AddAccountRepository } from '../../../src/data/protocols/db/db-account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../src/data/protocols/db/db-account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../../../src/data/protocols/db/db-account/load-account-by-token-repository'
import { AccountModel, AddAccountParams } from '../../../src/domain/models/account'
import { makeFakeAccount } from '../../domain/models/mocks/mock-account'

export const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return {
        ...makeFakeAccount(),
        password: 'hashed_password'
      }
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (value: AddAccountParams): Promise<AccountModel> {
      const account = {
        id: 'id_valid',
        ...value
      }
      return account
    }
  }
  return new AddAccountRepositoryStub()
}

export const makeLoadAccountByTokenStubRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string | undefined): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}
