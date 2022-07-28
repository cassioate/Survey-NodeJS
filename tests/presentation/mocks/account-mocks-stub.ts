import { AccountModel, AddAccountParams, AuthenticationParams } from '../../../src/domain/models/account'
import { AddAccount } from '../../../src/domain/usecases/account/add-account'
import { LoadAccountByToken } from '../../../src/domain/usecases/account/load-account-by-access-token'
import { Authentication } from '../../../src/domain/usecases/authentication/authentication'
import { makeFakeAccount } from '../../domain/models/mocks/mock-account'

export const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (accessToken: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenStub()
}

export const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountStub()
}

export const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}
