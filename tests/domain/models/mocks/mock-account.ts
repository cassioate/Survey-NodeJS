import { AccountModel, AddAccountParams } from '../../../../src/domain/models/account'

export const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

export const makeFakeAddAccountParams = (): AddAccountParams => {
  return {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  }
}
